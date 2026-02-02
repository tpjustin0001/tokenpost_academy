'use client'

/**
 * 강의 생성 페이지
 */

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createCourse } from '@/actions/courses'

export default function NewCoursePage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        description: '',
        accessLevel: 'plus' as 'free' | 'plus' | 'alpha',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError('')

        try {
            const result = await createCourse({
                title: formData.title,
                slug: formData.slug,
                description: formData.description,
                access_level: formData.accessLevel,
            })

            if (result.success) {
                router.push('/admin/courses')
            } else {
                setError(result.error || '강의 생성에 실패했습니다')
            }
        } catch (err) {
            console.error('Failed to create course:', err)
            setError('강의 생성 중 오류가 발생했습니다')
        } finally {
            setIsSubmitting(false)
        }
    }

    // 타이틀에서 slug 자동 생성
    const handleTitleChange = (title: string) => {
        setFormData({
            ...formData,
            title,
            slug: title
                .toLowerCase()
                .replace(/[^a-z0-9가-힣\s-]/g, '')
                .replace(/\s+/g, '-')
                .slice(0, 50),
        })
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* 페이지 헤더 */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white">새 강의 만들기</h1>
                <p className="text-slate-400 mt-1">새로운 강의를 생성합니다.</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* 기본 정보 */}
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-white">기본 정보</CardTitle>
                        <CardDescription className="text-slate-400">
                            강의의 기본 정보를 입력하세요.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* 강의명 */}
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-slate-300">강의명 *</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => handleTitleChange(e.target.value)}
                                placeholder="예: 웹3 핵심 개념 완벽 정리"
                                required
                                className="bg-slate-700 border-slate-600 text-white"
                            />
                        </div>

                        {/* Slug */}
                        <div className="space-y-2">
                            <Label htmlFor="slug" className="text-slate-300">URL 슬러그 *</Label>
                            <Input
                                id="slug"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                placeholder="web3-fundamentals"
                                required
                                className="bg-slate-700 border-slate-600 text-white"
                            />
                            <p className="text-xs text-slate-500">
                                URL: /courses/{formData.slug || 'slug'}
                            </p>
                        </div>

                        {/* 상세 설명 */}
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-slate-300">상세 설명</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="강의에 대한 상세한 설명을 작성하세요..."
                                rows={5}
                                className="bg-slate-700 border-slate-600 text-white resize-none"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* 접근 권한 */}
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-white">접근 권한</CardTitle>
                        <CardDescription className="text-slate-400">
                            이 강의를 볼 수 있는 구독 등급을 선택하세요.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Label className="text-slate-300">구독 등급</Label>
                            <Select
                                value={formData.accessLevel}
                                onValueChange={(value: 'free' | 'plus' | 'alpha') => setFormData({ ...formData, accessLevel: value })}
                            >
                                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-slate-700">
                                    <SelectItem value="free">🆓 무료 - 누구나 볼 수 있음</SelectItem>
                                    <SelectItem value="plus">⭐ Plus - Plus 구독자 이상</SelectItem>
                                    <SelectItem value="alpha">👑 Alpha - Alpha 구독자 전용</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* 버튼 */}
                <div className="flex items-center justify-end gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                    >
                        취소
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting || !formData.title || !formData.slug}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                        {isSubmitting ? '저장 중...' : '강의 생성'}
                    </Button>
                </div>
            </form>
        </div>
    )
}
