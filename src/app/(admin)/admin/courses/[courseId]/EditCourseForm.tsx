'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { updateCourse } from '@/actions/courses'

type Course = {
    id: string
    title: string
    slug: string
    description: string | null
    access_level: string
    thumbnail_url?: string | null
    status: string // 'draft' | 'published' | 'archived'
}

export default function EditCourseForm({ course }: { course: Course }) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        title: course.title,
        slug: course.slug,
        description: course.description || '',
        accessLevel: course.access_level as 'free' | 'plus' | 'alpha',
        status: course.status as 'draft' | 'published' | 'archived',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError('')

        try {
            const result = await updateCourse(course.id, {
                title: formData.title,
                slug: formData.slug,
                description: formData.description,
                access_level: formData.accessLevel,
                status: formData.status,
            })

            if (result.success) {
                router.refresh()
                router.push('/admin/courses')
            } else {
                setError(result.error || '강의 수정에 실패했습니다')
            }
        } catch (err) {
            console.error('Failed to update course:', err)
            setError('강의 수정 중 오류가 발생했습니다')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400">
                    {error}
                </div>
            )}

            <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                    <CardTitle className="text-white">기본 정보</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-slate-300">강의명</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            className="bg-slate-700 border-slate-600 text-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug" className="text-slate-300">URL 슬러그</Label>
                        <Input
                            id="slug"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            required
                            className="bg-slate-700 border-slate-600 text-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-slate-300">상세 설명</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={5}
                            className="bg-slate-700 border-slate-600 text-white resize-none"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                    <CardTitle className="text-white">설정</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-slate-300">공개 상태</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value: 'draft' | 'published' | 'archived') => setFormData({ ...formData, status: value })}
                            >
                                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-slate-700">
                                    <SelectItem value="draft">🟡 초안 (숨김)</SelectItem>
                                    <SelectItem value="published">🟢 게시됨 (공개)</SelectItem>
                                    <SelectItem value="archived">⚫ 보관됨</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-300">접근 권한</Label>
                            <Select
                                value={formData.accessLevel}
                                onValueChange={(value: 'free' | 'plus' | 'alpha') => setFormData({ ...formData, accessLevel: value })}
                            >
                                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-slate-700">
                                    <SelectItem value="free">🆓 무료</SelectItem>
                                    <SelectItem value="plus">⭐ Plus</SelectItem>
                                    <SelectItem value="alpha">👑 Alpha</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                >
                    취소
                </Button>
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                    {isSubmitting ? '저장 중...' : '변경사항 저장'}
                </Button>
            </div>
        </form>
    )
}
