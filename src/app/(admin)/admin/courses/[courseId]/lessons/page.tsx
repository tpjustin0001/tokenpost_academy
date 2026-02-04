'use client'

/**
 * 레슨 관리 페이지
 * 특정 강의의 모듈/레슨 목록 및 순서 관리
 */

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog'
import {
    getCourseById,
    getAdminCourseById, // Use dedicated admin fetcher
    createModule,
    updateModule,
    deleteModule,
    createLesson,
    updateLesson,
    deleteLesson,
    type ModuleWithLessons,
    type Lesson
} from '@/actions/courses'
import { getVimeoVideoInfo } from '@/actions/vimeo'
import { Textarea } from '@/components/ui/textarea'

// 접근 권한 뱃지
function getAccessBadge(level: string) {
    switch (level) {
        case 'free':
            return <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs">🆓 무료</Badge>
        case 'plus':
            return <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs">⭐ Plus</Badge>
        case 'alpha':
            return <Badge className="bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs">👑 Alpha</Badge>
        default:
            return null
    }
}

export default function LessonsManagePage() {
    const params = useParams()
    const router = useRouter()
    const courseId = params.courseId as string

    const [course, setCourse] = useState<{ title: string; modules: ModuleWithLessons[] } | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    // Module 관련 상태
    const [newModuleTitle, setNewModuleTitle] = useState('')
    const [editingModuleId, setEditingModuleId] = useState<string | null>(null)
    const [moduleNameInput, setModuleNameInput] = useState('')

    // Lesson 관련 상태
    const [newLessonTitle, setNewLessonTitle] = useState('')
    const [editingLessonId, setEditingLessonId] = useState<string | null>(null)
    const [vimeoIdInput, setVimeoIdInput] = useState('')
    const [vimeoEmbedUrlInput, setVimeoEmbedUrlInput] = useState('')
    const [durationInput, setDurationInput] = useState('')
    const [descriptionInput, setDescriptionInput] = useState('')
    const [thumbnailUrlInput, setThumbnailUrlInput] = useState('')
    const [lessonAccessLevel, setLessonAccessLevel] = useState<'free' | 'plus' | 'alpha'>('plus')

    // 데이터 로드
    useEffect(() => {
        loadCourse()
    }, [courseId])

    const loadCourse = async () => {
        setLoading(true)
        // [MODIFIED] Use getAdminCourseById to ensure raw video data is fetched for editing
        const data = await getAdminCourseById(courseId)
        if (data) {
            setCourse({ title: data.title, modules: data.modules || [] })
        }
        setLoading(false)
    }

    // === 모듈 CRUD ===
    const handleAddModule = async () => {
        if (!newModuleTitle.trim()) return
        setSaving(true)

        const result = await createModule(courseId, newModuleTitle)
        if (result.success) {
            await loadCourse()
            setNewModuleTitle('')
        }
        setSaving(false)
    }

    const handleSaveModuleName = async (moduleId: string) => {
        if (!moduleNameInput.trim()) return
        setSaving(true)

        await updateModule(moduleId, moduleNameInput)
        await loadCourse()
        setEditingModuleId(null)
        setModuleNameInput('')
        setSaving(false)
    }

    const handleDeleteModule = async (moduleId: string) => {
        if (!confirm('이 모듈과 모든 레슨이 삭제됩니다. 계속하시겠습니까?')) return
        setSaving(true)

        await deleteModule(moduleId)
        await loadCourse()
        setSaving(false)
    }

    // === 레슨 CRUD ===
    const handleAddLesson = async (moduleId: string) => {
        if (!newLessonTitle.trim()) return
        setSaving(true)

        await createLesson(moduleId, {
            title: newLessonTitle,
            access_level: 'plus'
        })
        await loadCourse()
        setNewLessonTitle('')
        setSaving(false)
    }

    const extractVimeoId = (input: string): string => {
        if (!input) return ''

        // 1. iframe 태그나 전체 HTML에서 src 추출 시도
        const iframeMatch = input.match(/src="([^"]+)"/)
        let urlToCheck = input

        if (iframeMatch) {
            urlToCheck = iframeMatch[1]
        }

        // 2. ID 추출 (vimeo.com/123 or player.vimeo.com/video/123)
        const idMatch = urlToCheck.match(/(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)(\d+)/)
        return idMatch ? idMatch[1] : input.trim()
    }

    const extractEmbedSrc = (input: string): string => {
        if (!input) return ''
        const iframeMatch = input.match(/src="([^"]+)"/)
        return iframeMatch ? iframeMatch[1] : input.trim()
    }

    const handleSaveLesson = async (lessonId: string) => {
        setSaving(true)
        const vimeoId = extractVimeoId(vimeoIdInput)
        // Embed URL 필드에 전체 iframe 코드를 넣었을 경우 clean URL만 추출
        const vimeoEmbedUrl = extractEmbedSrc(vimeoEmbedUrlInput)

        await updateLesson(lessonId, {
            vimeo_id: vimeoId.match(/^\d+$/) ? vimeoId : null, // ID가 숫자일 때만 저장
            vimeo_embed_url: vimeoEmbedUrl || null,
            duration: durationInput || null,
            description: descriptionInput || null,
            thumbnail_url: thumbnailUrlInput || null,
            access_level: lessonAccessLevel
        })
        await loadCourse()
        setEditingLessonId(null)
        setVimeoIdInput('')
        setVimeoEmbedUrlInput('')
        setDurationInput('')
        setDescriptionInput('')
        setThumbnailUrlInput('')
        setSaving(false)
    }

    const handleDeleteLesson = async (lessonId: string) => {
        if (!confirm('이 레슨을 삭제하시겠습니까?')) return
        setSaving(true)

        await deleteLesson(lessonId)
        await loadCourse()
        setSaving(false)
    }

    const openLessonDialog = (lesson: Lesson) => {
        setEditingLessonId(lesson.id)
        setVimeoIdInput(lesson.vimeo_id || '')
        setVimeoEmbedUrlInput(lesson.vimeo_embed_url || '')
        setDurationInput(lesson.duration || '')
        setDescriptionInput(lesson.description || '')
        setThumbnailUrlInput(lesson.thumbnail_url || '')
        setLessonAccessLevel(lesson.access_level)
    }

    const handleFetchVimeoInfo = async () => {
        if (!vimeoIdInput) return
        setLoading(true)
        const result = await getVimeoVideoInfo(vimeoIdInput)
        if (result.success && result.data) {
            setDurationInput(result.data.duration)
            setDescriptionInput(result.data.description)
            setThumbnailUrlInput(result.data.thumbnail_url)
            alert('Vimeo 정보를 성공적으로 가져왔습니다!')
        } else {
            alert('Vimeo 정보를 가져오지 못했습니다.')
        }
        setLoading(false)
    }

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-[400px]">
                <div className="text-slate-400">로딩 중...</div>
            </div>
        )
    }

    if (!course) {
        return (
            <div className="p-6">
                <div className="text-center py-12">
                    <p className="text-slate-400 mb-4">강의를 찾을 수 없습니다</p>
                    <Link href="/admin/courses">
                        <Button variant="outline">강의 목록으로</Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 space-y-6">
            {/* 페이지 헤더 */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                        <Link href="/admin/courses" className="hover:text-white">강의 관리</Link>
                        <span>/</span>
                        <span>커리큘럼</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white">{course.title}</h1>
                    <p className="text-slate-400 mt-1">모듈과 레슨을 관리합니다</p>
                </div>
            </div>

            {/* 새 모듈 추가 */}
            <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="pt-6">
                    <div className="flex gap-4">
                        <Input
                            value={newModuleTitle}
                            onChange={(e) => setNewModuleTitle(e.target.value)}
                            placeholder="새 모듈 제목 (예: 블록체인 기초)"
                            className="bg-slate-700 border-slate-600 text-white flex-1"
                        />
                        <Button
                            onClick={handleAddModule}
                            disabled={saving || !newModuleTitle.trim()}
                            className="bg-gradient-to-r from-blue-600 to-purple-600"
                        >
                            + 모듈 추가
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* 모듈 목록 */}
            {course.modules.length === 0 ? (
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="py-12 text-center">
                        <p className="text-slate-400">
                            아직 모듈이 없습니다. 위에서 첫 번째 모듈을 추가하세요.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    {course.modules.map((module) => (
                        <Card key={module.id} className="bg-slate-800/50 border-slate-700">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-slate-500 cursor-move">⣿</span>
                                    <CardTitle className="text-white">{module.title}</CardTitle>

                                    {/* 모듈 이름 수정 다이얼로그 */}
                                    <Dialog open={editingModuleId === module.id} onOpenChange={(open) => !open && setEditingModuleId(null)}>
                                        <DialogTrigger asChild>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-slate-400 hover:text-white h-6 w-6 p-0"
                                                onClick={() => {
                                                    setEditingModuleId(module.id)
                                                    setModuleNameInput(module.title)
                                                }}
                                            >
                                                ✏️
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="bg-slate-800 border-slate-700">
                                            <DialogHeader>
                                                <DialogTitle className="text-white">모듈 이름 수정</DialogTitle>
                                            </DialogHeader>
                                            <div className="space-y-4 pt-4">
                                                <Input
                                                    value={moduleNameInput}
                                                    onChange={(e) => setModuleNameInput(e.target.value)}
                                                    className="bg-slate-700 border-slate-600 text-white"
                                                />
                                                <div className="flex gap-2">
                                                    <Button
                                                        onClick={() => handleSaveModuleName(module.id)}
                                                        disabled={saving}
                                                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
                                                    >
                                                        저장
                                                    </Button>
                                                    <DialogClose asChild>
                                                        <Button variant="outline" className="flex-1">취소</Button>
                                                    </DialogClose>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>

                                    <Badge variant="outline" className="text-slate-400">
                                        {module.lessons?.length || 0}개 레슨
                                    </Badge>
                                </div>

                                <div className="flex items-center gap-2">
                                    {/* 새 레슨 추가 다이얼로그 */}
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button size="sm" variant="outline">+ 레슨 추가</Button>
                                        </DialogTrigger>
                                        <DialogContent className="bg-slate-800 border-slate-700">
                                            <DialogHeader>
                                                <DialogTitle className="text-white">새 레슨 추가</DialogTitle>
                                            </DialogHeader>
                                            <div className="space-y-4 pt-4">
                                                <div className="space-y-2">
                                                    <Label className="text-slate-300">레슨 제목</Label>
                                                    <Input
                                                        value={newLessonTitle}
                                                        onChange={(e) => setNewLessonTitle(e.target.value)}
                                                        placeholder="레슨 제목을 입력하세요"
                                                        className="bg-slate-700 border-slate-600 text-white"
                                                    />
                                                </div>
                                                <Button
                                                    onClick={() => handleAddLesson(module.id)}
                                                    disabled={saving || !newLessonTitle.trim()}
                                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                                                >
                                                    레슨 추가
                                                </Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>

                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="text-red-400 hover:text-red-300"
                                        onClick={() => handleDeleteModule(module.id)}
                                    >
                                        🗑️
                                    </Button>
                                </div>
                            </CardHeader>

                            <CardContent>
                                <div className="space-y-2">
                                    {(!module.lessons || module.lessons.length === 0) ? (
                                        <p className="text-slate-500 text-center py-4">레슨이 없습니다</p>
                                    ) : (
                                        module.lessons.map((lesson) => (
                                            <div
                                                key={lesson.id}
                                                className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <span className="text-slate-500 cursor-move">⣿</span>
                                                    <div>
                                                        <p className="text-white font-medium">{lesson.title}</p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            {lesson.duration && (
                                                                <span className="text-sm text-slate-500">{lesson.duration}</span>
                                                            )}
                                                            {getAccessBadge(lesson.access_level)}
                                                            {lesson.vimeo_id ? (
                                                                <Badge className="bg-green-500/20 text-green-400 text-xs">Vimeo 연결됨</Badge>
                                                            ) : (
                                                                <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">영상 없음</Badge>
                                                            )}
                                                            {!lesson.is_published && (
                                                                <Badge className="bg-slate-500/20 text-slate-400 text-xs">비공개</Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {/* 레슨 편집 다이얼로그 */}
                                                    <Dialog open={editingLessonId === lesson.id} onOpenChange={(open) => !open && setEditingLessonId(null)}>
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => openLessonDialog(lesson)}
                                                            >
                                                                {lesson.vimeo_id ? '수정' : 'Vimeo 연결'}
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="bg-slate-800 border-slate-700 max-w-md">
                                                            <DialogHeader>
                                                                <DialogTitle className="text-white">레슨 편집</DialogTitle>
                                                            </DialogHeader>
                                                            <div className="space-y-4 pt-4">
                                                                <div className="space-y-2">
                                                                    <Label className="text-slate-300">Vimeo URL 또는 ID</Label>
                                                                    <div className="flex gap-2">
                                                                        <Input
                                                                            value={vimeoIdInput}
                                                                            onChange={(e) => setVimeoIdInput(e.target.value)}
                                                                            placeholder="https://vimeo.com/123456789"
                                                                            className="bg-slate-700 border-slate-600 text-white flex-1"
                                                                        />
                                                                        <Button
                                                                            type="button"
                                                                            variant="secondary"
                                                                            onClick={handleFetchVimeoInfo}
                                                                            disabled={loading || !vimeoIdInput}
                                                                            className="shrink-0"
                                                                        >
                                                                            정보 가져오기
                                                                        </Button>
                                                                    </div>
                                                                    <p className="text-xs text-slate-500">
                                                                        공개 또는 도메인 제한된 영상의 URL을 입력하세요.
                                                                    </p>
                                                                </div>

                                                                <div className="space-y-2">
                                                                    <Label className="text-slate-300">임베드 코드/URL (비공개 영상용)</Label>
                                                                    <Textarea
                                                                        value={vimeoEmbedUrlInput}
                                                                        onChange={(e) => setVimeoEmbedUrlInput(e.target.value)}
                                                                        placeholder='<iframe src="https://player.vimeo.com/video/..." ...></iframe>'
                                                                        className="bg-slate-700 border-slate-600 text-white min-h-[80px] font-mono text-xs"
                                                                    />
                                                                    <p className="text-xs text-slate-500">
                                                                        Vimeo에서 복사한 전체 임베드 코드를 붙여넣으면 자동으로 주소만 추출하여 저장합니다.
                                                                    </p>
                                                                </div>

                                                                <div className="space-y-2">
                                                                    <Label className="text-slate-300">재생 시간</Label>
                                                                    <Input
                                                                        value={durationInput}
                                                                        onChange={(e) => setDurationInput(e.target.value)}
                                                                        placeholder="예: 12:34"
                                                                        className="bg-slate-700 border-slate-600 text-white"
                                                                    />
                                                                </div>

                                                                <div className="space-y-2">
                                                                    <Label className="text-slate-300">설명 (Summary)</Label>
                                                                    <Textarea
                                                                        value={descriptionInput}
                                                                        onChange={(e) => setDescriptionInput(e.target.value)}
                                                                        placeholder="강의 설명을 입력하세요"
                                                                        className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
                                                                    />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label className="text-slate-300">접근 권한</Label>
                                                                    <Select
                                                                        value={lessonAccessLevel}
                                                                        onValueChange={(v: 'free' | 'plus' | 'alpha') => setLessonAccessLevel(v)}
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

                                                                {/* Vimeo 미리보기 */}
                                                                {vimeoIdInput && extractVimeoId(vimeoIdInput) && (
                                                                    <div className="aspect-video rounded overflow-hidden bg-black">
                                                                        <iframe
                                                                            src={`https://player.vimeo.com/video/${extractVimeoId(vimeoIdInput)}`}
                                                                            className="w-full h-full"
                                                                            allow="autoplay; fullscreen"
                                                                        />
                                                                    </div>
                                                                )}

                                                                <div className="flex gap-2">
                                                                    <Button
                                                                        onClick={() => handleSaveLesson(lesson.id)}
                                                                        disabled={saving}
                                                                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
                                                                    >
                                                                        저장
                                                                    </Button>
                                                                    <DialogClose asChild>
                                                                        <Button variant="outline" className="flex-1">취소</Button>
                                                                    </DialogClose>
                                                                </div>
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>

                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="text-red-400 hover:text-red-300"
                                                        onClick={() => handleDeleteLesson(lesson.id)}
                                                    >
                                                        🗑️
                                                    </Button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
