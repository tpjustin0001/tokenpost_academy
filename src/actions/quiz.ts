'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getQuizForLesson(lessonId: string) {
    const supabase = await createClient()

    // 1. 해당 레슨의 퀴즈 ID 조회
    const { data: quiz, error: quizError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('lesson_id', lessonId)
        .single()

    if (quizError || !quiz) {
        return { quiz: null, questions: [] }
    }

    // 2. 퀴즈의 질문 조회
    const { data: questions, error: questionsError } = await supabase
        .from('quiz_questions')
        .select('id, question, options, explanation, order_index') // 정답(correct_answer)은 클라이언트에 보내지 않음 (보안)
        .eq('quiz_id', quiz.id)
        .order('order_index', { ascending: true })

    if (questionsError) {
        console.error('Error fetching quiz questions:', questionsError)
        return { quiz: null, questions: [] }
    }

    return { quiz, questions }
}

export async function checkQuizAnswers(quizId: string, userAnswers: Record<string, number>) {
    const supabase = await createClient()

    // 1. 정답 조회
    const { data: questions, error } = await supabase
        .from('quiz_questions')
        .select('id, correct_answer')
        .eq('quiz_id', quizId)

    if (error || !questions) {
        throw new Error('Failed to fetch correct answers')
    }

    // 2. 채점
    let correctCount = 0
    questions.forEach((q: { id: string; correct_answer: number }) => {
        if (userAnswers[q.id] === q.correct_answer) {
            correctCount++
        }
    })

    const score = Math.round((correctCount / questions.length) * 100)

    // 3. 퀴즈 정보 조회 (통과 기준 확인)
    const { data: quiz } = await supabase
        .from('quizzes')
        .select('passing_score')
        .eq('id', quizId)
        .single()

    const passed = score >= (quiz?.passing_score || 70)

    // 4. 시도 기록 저장
    const { data: { user } } = await supabase.auth.getUser()
    let leveledUp = false
    if (user) {
        await supabase.from('quiz_attempts').insert({
            user_id: user.id,
            quiz_id: quizId,
            score,
            passed
        })
        // 5. 포인트 지급 (통과 시)
        if (passed && user) {
            const { awardPoints } = await import('./gamification')

            // 이미 통과한 기록이 있는지 확인 (중복 지급 방지)
            // 더 정확한 중복 방지 로직:
            const { count } = await supabase
                .from('quiz_attempts')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .eq('quiz_id', quizId)
                .eq('passed', true)

            // 이번이 첫 통과라면 포인트 지급 (count가 1이어야 함. 방금 insert했으므로.)
            // 하지만 동시성 이슈가 있을 수 있으니, 간단히 "이번 시도가 통과이고, 이전 통과 기록이 1개 이하라면 지급" 등으로 처리하거나
            // 혹은 그냥 클라이언트에서 축하 메시지만 보여주고 서버에서厳밀하게 체크.

            // 여기서는 "방금 Insert한 것 포함해서 통과 기록이 1개라면" 지급
            if (count === 1) {
                const result = await awardPoints(user.id, 50, `Quiz Passed: ${quizId}`)
                leveledUp = result.leveledUp
            }
        }
    }

    return { score, passed, correctCount, totalQuestions: questions.length, leveledUp }
}
