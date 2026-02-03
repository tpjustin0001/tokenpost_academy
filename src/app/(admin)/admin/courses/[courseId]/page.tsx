
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { getCourseBySlug } from '@/actions/courses'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { updateCourse } from '@/actions/courses'
import { getCourseById } from '@/actions/courses'
import EditCourseForm from './EditCourseForm'

type Props = {
    params: Promise<{
        courseId: string
    }>
}

export default async function EditCoursePage({ params }: Props) {
    const { courseId } = await params
    const course = await getCourseById(courseId)

    if (!course) {
        notFound()
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white">강의 수정: {course.title}</h1>
                    <p className="text-slate-400 mt-1">강의 정보를 수정합니다.</p>
                </div>
                <div className="flex gap-2">
                    <Link href={`/admin/courses/${courseId}/lessons`}>
                        <Button variant="outline" className="text-slate-900 border-white/20 bg-white hover:bg-slate-200">
                            📚 커리큘럼 편집
                        </Button>
                    </Link>
                    <Link href="/admin/courses">
                        <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-white/10">목록으로</Button>
                    </Link>
                </div>
            </div>

            <EditCourseForm course={course} />
        </div>
    )
}
