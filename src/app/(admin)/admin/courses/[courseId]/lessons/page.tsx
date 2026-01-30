'use client'

/**
 * 레슨 관리 페이지
 * 특정 강의의 레슨 목록 및 순서 관리
 */

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { VideoUpload } from '@/components/admin/VideoUpload'

interface Lesson {
    id: string
    title: string
    duration: string
    videoUid: string | null
    order: number
    isPublished: boolean
}

interface Module {
    id: string
    title: string
    order: number
    lessons: Lesson[]
}

// TODO: Supabase에서 실제 데이터 조회
const MOCK_MODULES: Module[] = [
    {
        id: 'module-1',
        title: '블록체인 기초',
        order: 1,
        lessons: [
            { id: 'lesson-1', title: '블록체인이란 무엇인가?', duration: '15:30', videoUid: 'abc123', order: 1, isPublished: true },
            { id: 'lesson-2', title: '탈중앙화의 의미', duration: '12:45', videoUid: 'def456', order: 2, isPublished: true },
            { id: 'lesson-3', title: '합의 알고리즘 이해하기', duration: '18:20', videoUid: null, order: 3, isPublished: false },
        ],
    },
    {
        id: 'module-2',
        title: '스마트 컨트랙트',
        order: 2,
        lessons: [
            { id: 'lesson-4', title: '스마트 컨트랙트 개념', duration: '14:00', videoUid: 'ghi789', order: 1, isPublished: true },
        ],
    },
]

export default function LessonsManagePage() {
    const params = useParams()
    const router = useRouter()
    const courseId = params.courseId as string

    const [modules, setModules] = useState(MOCK_MODULES)
    const [newLessonTitle, setNewLessonTitle] = useState('')
    const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null)

    const handleAddLesson = (moduleId: string) => {
        if (!newLessonTitle.trim()) return

        // TODO: Supabase에 저장
        console.log('Adding lesson:', { moduleId, title: newLessonTitle })

        setNewLessonTitle('')
        setSelectedModuleId(null)
    }

    const handleVideoUploadComplete = (lessonId: string, videoUid: string) => {
        // TODO: Supabase에 videoUid 업데이트
        console.log('Video uploaded for lesson:', { lessonId, videoUid })
    }

    return (
        <div className="p-6 space-y-6">
            {/* 페이지 헤더 */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 text-sm text-slate-400 mb-2">
                        <Link href="/admin/courses" className="hover:text-white">강의 관리</Link>
                        <span>/</span>
                        <span>레슨 관리</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white">레슨 관리</h1>
                    <p className="text-slate-400 mt-1">강의의 모듈과 레슨을 관리합니다.</p>
                </div>
                <Button
                    onClick={() => {/* TODO: 모듈 추가 */ }}
                    variant="outline"
                >
                    + 새 모듈
                </Button>
            </div>

            {/* 모듈 목록 */}
            <div className="space-y-6">
                {modules.map((module) => (
                    <Card key={module.id} className="bg-slate-800/50 border-slate-700">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-slate-500 cursor-move">⣿</span>
                                <CardTitle className="text-white">{module.title}</CardTitle>
                                <Badge variant="outline" className="text-slate-400">
                                    {module.lessons.length}개 레슨
                                </Badge>
                            </div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button size="sm" variant="outline" onClick={() => setSelectedModuleId(module.id)}>
                                        + 레슨 추가
                                    </Button>
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
                                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                                        >
                                            레슨 추가
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {module.lessons.map((lesson) => (
                                    <div
                                        key={lesson.id}
                                        className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition"
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className="text-slate-500 cursor-move">⣿</span>
                                            <div>
                                                <p className="text-white font-medium">{lesson.title}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-sm text-slate-500">{lesson.duration}</span>
                                                    {lesson.videoUid ? (
                                                        <Badge className="bg-green-500/20 text-green-400 text-xs">영상 있음</Badge>
                                                    ) : (
                                                        <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">영상 없음</Badge>
                                                    )}
                                                    {!lesson.isPublished && (
                                                        <Badge className="bg-slate-500/20 text-slate-400 text-xs">비공개</Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button size="sm" variant="outline">
                                                        영상 업로드
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="bg-slate-800 border-slate-700 max-w-xl">
                                                    <DialogHeader>
                                                        <DialogTitle className="text-white">영상 업로드</DialogTitle>
                                                    </DialogHeader>
                                                    <VideoUpload
                                                        onUploadComplete={(videoUid) => handleVideoUploadComplete(lesson.id, videoUid)}
                                                        onError={(error) => console.error(error)}
                                                    />
                                                </DialogContent>
                                            </Dialog>
                                            <Button size="sm" variant="ghost">
                                                수정
                                            </Button>
                                        </div>
                                    </div>
                                ))}

                                {module.lessons.length === 0 && (
                                    <p className="text-center py-8 text-slate-500">
                                        레슨이 없습니다. 첫 번째 레슨을 추가하세요.
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
