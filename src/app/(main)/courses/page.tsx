/**
 * 강의 목록 페이지
 * Unrolled 형태로 모든 과정, 모듈, 레슨을 펼쳐서 보여줍니다.
 */

import { getCoursesWithModules } from '@/actions/courses-unrolled'
import { UnrolledCourseList } from '@/components/course/UnrolledCourseList'

export default async function CoursesPage() {
    const courses = await getCoursesWithModules()

    return (
        <div className="min-h-screen bg-background py-12 px-6">
            <div className="max-w-4xl mx-auto">
                {/* 헤더 */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-foreground mb-4">전체 강의</h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        TokenPost Academy의 모든 커리큘럼을 단계별로 학습하세요.
                    </p>
                </div>

                {/* Unrolled List */}
                {courses.length === 0 ? (
                    <div className="text-center py-20 text-muted-foreground">
                        <p className="text-xl">등록된 강의가 없습니다.</p>
                    </div>
                ) : (
                    <UnrolledCourseList courses={courses} />
                )}
            </div>
        </div>
    )
}
