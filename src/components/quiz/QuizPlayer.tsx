'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { checkQuizAnswers } from '@/actions/quiz'
import { toast } from 'sonner'
import { Award, CheckCircle, XCircle } from 'lucide-react'
import confetti from 'canvas-confetti'

type Question = {
    id: string
    question: string
    options: string[]
    explanation?: string
    order_index: number
}

type QuizPlayerProps = {
    quizId: string
    title: string
    questions: Question[]
    onComplete?: () => void
}

export function QuizPlayer({ quizId, title, questions, onComplete }: QuizPlayerProps) {
    const [answers, setAnswers] = React.useState<Record<string, number>>({})
    const [isSubmitting, setIsSubmitting] = React.useState(false)
    const [result, setResult] = React.useState<{ score: number, passed: boolean, leveledUp?: boolean } | null>(null)

    const handleSelect = (questionId: string, optionIndex: number) => {
        if (result) return // 이미 제출했으면 수정 불가
        setAnswers(prev => ({
            ...prev,
            [questionId]: optionIndex
        }))
    }

    const handleSubmit = async () => {
        if (Object.keys(answers).length < questions.length) {
            toast.error('모든 문제에 답해주세요.')
            return
        }

        setIsSubmitting(true)
        try {
            const res = await checkQuizAnswers(quizId, answers)
            setResult(res)

            if (res.passed) {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                })
                toast.success(`퀴즈 통과! ${res.score}점 획득!`)
                if (res.leveledUp) {
                    setTimeout(() => toast.success("레벨 업! 축하합니다! 🎉"), 1000)
                }
                onComplete?.()
            } else {
                toast.error(`아쉽습니다. ${res.score}점 (통과 기준 미달)`)
            }
        } catch (error) {
            console.error(error)
            toast.error('채점 중 오류가 발생했습니다.')
        } finally {
            setIsSubmitting(false)
        }
    }

    // 결과 화면
    if (result) {
        return (
            <Card className="w-full mt-8 border-2 border-slate-100 dark:border-slate-800">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto mb-4">
                        {result.passed ? (
                            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400">
                                <Award className="w-8 h-8" />
                            </div>
                        ) : (
                            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto text-red-600 dark:text-red-400">
                                <XCircle className="w-8 h-8" />
                            </div>
                        )}
                    </div>
                    <CardTitle className="text-2xl">
                        {result.passed ? '축하합니다!' : '다시 도전해보세요'}
                    </CardTitle>
                    <CardDescription>
                        점수: <span className="font-bold text-foreground text-lg">{result.score}점</span>
                        {result.passed && <span className="text-emerald-500 ml-2 font-medium">(+50 Point)</span>}
                    </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-center pb-8">
                    {!result.passed ? (
                        <Button onClick={() => { setResult(null); setAnswers({}); }}>
                            다시 풀기
                        </Button>
                    ) : (
                        <Button variant="outline" className="cursor-default text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-900/10 dark:border-emerald-500/30">
                            학습 완료
                        </Button>
                    )}
                </CardFooter>
            </Card>
        )
    }

    // 퀴즈 풀이 화면
    return (
        <Card className="w-full mt-8">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-500" />
                    {title}
                </CardTitle>
                <CardDescription>
                    총 {questions.length}문제 | 통과 시 50포인트 획득
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                {questions.map((q, index) => (
                    <div key={q.id} className="space-y-4">
                        <h4 className="font-medium text-lg">
                            <span className="text-muted-foreground mr-2">Q{index + 1}.</span>
                            {q.question}
                        </h4>
                        <RadioGroup
                            value={answers[q.id]?.toString()} // RadioGroup value expects string
                            onValueChange={(val) => handleSelect(q.id, parseInt(val))}
                            className="space-y-2 pl-1"
                        >
                            {q.options.map((option, optIdx) => (
                                <div key={optIdx} className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900
                                    ${answers[q.id] === optIdx ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' : 'border-transparent hover:border-border'}
                                `}>
                                    <RadioGroupItem value={optIdx.toString()} id={`${q.id}-${optIdx}`} />
                                    <Label htmlFor={`${q.id}-${optIdx}`} className="flex-1 cursor-pointer font-normal leading-relaxed">
                                        {option}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>
                ))}
            </CardContent>
            <CardFooter>
                <Button
                    className="w-full sm:w-auto ml-auto bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? '채점 중...' : '제출하기'}
                </Button>
            </CardFooter>
        </Card>
    )
}
