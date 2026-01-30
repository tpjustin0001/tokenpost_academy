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
import { Switch } from '@/components/ui/switch'

export default function NewCoursePage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        description: '',
        shortDescription: '',
        level: 'beginner',
        price: '',
        isPublished: false,
        thumbnailUrl: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            // TODO: Supabase에 저장
            console.log('Creating course:', formData)

            // 성공 시 목록으로 이동
            router.push('/admin/courses')
        } catch (error) {
            console.error('Failed to create course:', error)
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
                            <Label htmlFor="slug" className="text-slate-300">URL 슬러그</Label>
                            <Input
                                id="slug"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                placeholder="web3-fundamentals"
                                className="bg-slate-700 border-slate-600 text-white"
                            />
                            <p className="text-xs text-slate-500">
                                URL: /courses/{formData.slug || 'slug'}
                            </p>
                        </div>

                        {/* 간단 설명 */}
                        <div className="space-y-2">
                            <Label htmlFor="shortDescription" className="text-slate-300">간단 설명</Label>
                            <Input
                                id="shortDescription"
                                value={formData.shortDescription}
                                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                                placeholder="강의를 한 줄로 설명하세요"
                                className="bg-slate-700 border-slate-600 text-white"
                            />
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

                {/* 가격 및 레벨 */}
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-white">가격 및 레벨</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* 가격 */}
                        <div className="space-y-2">
                            <Label htmlFor="price" className="text-slate-300">가격 (원)</Label>
                            <Input
                                id="price"
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                placeholder="99000"
                                className="bg-slate-700 border-slate-600 text-white"
                            />
                        </div>

                        {/* 레벨 */}
                        <div className="space-y-2">
                            <Label className="text-slate-300">난이도</Label>
                            <Select
                                value={formData.level}
                                onValueChange={(value) => setFormData({ ...formData, level: value })}
                            >
                                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-slate-700">
                                    <SelectItem value="beginner">입문</SelectItem>
                                    <SelectItem value="intermediate">중급</SelectItem>
                                    <SelectItem value="advanced">고급</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* 게시 설정 */}
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-white">게시 설정</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-slate-300">게시 상태</Label>
                                <p className="text-sm text-slate-500">
                                    활성화하면 사용자에게 강의가 표시됩니다.
                                </p>
                            </div>
                            <Switch
                                checked={formData.isPublished}
                                onCheckedChange={(checked) => setFormData({ ...formData, isPublished: checked })}
                            />
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
                        disabled={isSubmitting}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                        {isSubmitting ? '저장 중...' : '강의 생성'}
                    </Button>
                </div>
            </form>
        </div>
    )
}
