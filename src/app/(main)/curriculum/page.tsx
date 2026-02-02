import { getCourses } from '@/actions/courses'
import { CurriculumTimeline } from '@/components/curriculum/CurriculumTimeline'

export const dynamic = 'force-dynamic'

export default async function CurriculumPage() {
    const courses = await getCourses()

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            <CurriculumTimeline courses={courses} />
        </div>
    )
}
