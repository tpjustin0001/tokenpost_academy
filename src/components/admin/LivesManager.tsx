'use client'

/**
 * 라이브 관리 컴포넌트 (Admin)
 */

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { createLive, updateLive, deleteLive, toggleLiveStatus, type Live, type CreateLiveInput } from '@/actions/lives'
import { Plus, Pencil, Trash2, Video, Calendar, Clock, Eye } from 'lucide-react'
import { toast } from 'sonner'

interface LivesManagerProps {
    initialLives: Live[]
}

export function LivesManager({ initialLives }: LivesManagerProps) {
    const [lives, setLives] = useState<Live[]>(initialLives)
    const [isCreating, setIsCreating] = useState(false)
    const [editingLive, setEditingLive] = useState<Live | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    // Form state
    const [formData, setFormData] = useState<CreateLiveInput>({
        title: '',
        description: '',
        youtube_id: '',
        thumbnail_url: '',
        is_live: false,
        scheduled_at: new Date().toISOString().slice(0, 16),
        duration: '',
    })

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            youtube_id: '',
            thumbnail_url: '',
            is_live: false,
            scheduled_at: new Date().toISOString().slice(0, 16),
            duration: '',
        })
        setEditingLive(null)
    }

    const handleOpenCreate = () => {
        resetForm()
        setIsDialogOpen(true)
    }

    const handleOpenEdit = (live: Live) => {
        setEditingLive(live)
        setFormData({
            title: live.title,
            description: live.description || '',
            youtube_id: live.youtube_id,
            thumbnail_url: live.thumbnail_url || '',
            is_live: live.is_live,
            scheduled_at: live.scheduled_at?.slice(0, 16) || '',
            duration: live.duration || '',
        })
        setIsDialogOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsCreating(true)

        try {
            if (editingLive) {
                // Update existing
                const result = await updateLive(editingLive.id, formData)
                if (result.success) {
                    toast.success('라이브가 수정되었습니다.')
                    // Refresh
                    window.location.reload()
                } else {
                    toast.error(result.error || '수정 실패')
                }
            } else {
                // Create new
                const result = await createLive(formData)
                if (result.success && result.data) {
                    toast.success('라이브가 추가되었습니다.')
                    setLives([result.data, ...lives])
                    setIsDialogOpen(false)
                    resetForm()
                } else {
                    toast.error(result.error || '추가 실패')
                }
            }
        } catch (error) {
            toast.error('오류가 발생했습니다.')
        } finally {
            setIsCreating(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('정말 삭제하시겠습니까?')) return

        const result = await deleteLive(id)
        if (result.success) {
            toast.success('삭제되었습니다.')
            setLives(lives.filter(l => l.id !== id))
        } else {
            toast.error(result.error || '삭제 실패')
        }
    }

    const handleToggleLive = async (id: string, currentStatus: boolean) => {
        const result = await toggleLiveStatus(id, !currentStatus)
        if (result.success) {
            setLives(lives.map(l =>
                l.id === id ? { ...l, is_live: !currentStatus } : l
            ))
            toast.success(currentStatus ? '라이브 종료됨' : '라이브 시작됨')
        }
    }

    const extractYoutubeId = (url: string) => {
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
        const match = url.match(regex)
        return match ? match[1] : url
    }

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className="space-y-6">
            {/* Add New Button */}
            <div className="flex justify-end">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={handleOpenCreate} className="gap-2">
                            <Plus className="w-4 h-4" />
                            새 라이브 추가
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-900 border-slate-700 max-w-lg">
                        <DialogHeader>
                            <DialogTitle className="text-white">
                                {editingLive ? '라이브 수정' : '새 라이브 추가'}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                            <div>
                                <label className="text-sm text-slate-400 mb-1 block">제목 *</label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="라이브 제목"
                                    required
                                    className="bg-slate-800 border-slate-600 text-white"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-slate-400 mb-1 block">유튜브 ID 또는 URL *</label>
                                <Input
                                    value={formData.youtube_id}
                                    onChange={(e) => setFormData({ ...formData, youtube_id: extractYoutubeId(e.target.value) })}
                                    placeholder="ex) dQw4w9WgXcQ 또는 전체 URL"
                                    required
                                    className="bg-slate-800 border-slate-600 text-white"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-slate-400 mb-1 block">설명</label>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="라이브 설명"
                                    className="bg-slate-800 border-slate-600 text-white min-h-[80px]"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm text-slate-400 mb-1 block">방송 일시</label>
                                    <Input
                                        type="datetime-local"
                                        value={formData.scheduled_at}
                                        onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                                        className="bg-slate-800 border-slate-600 text-white"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-slate-400 mb-1 block">재생 시간</label>
                                    <Input
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                        placeholder="ex) 1:23:45"
                                        className="bg-slate-800 border-slate-600 text-white"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_live"
                                    checked={formData.is_live}
                                    onChange={(e) => setFormData({ ...formData, is_live: e.target.checked })}
                                    className="w-4 h-4"
                                />
                                <label htmlFor="is_live" className="text-sm text-slate-300">
                                    현재 라이브 중
                                </label>
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                    취소
                                </Button>
                                <Button type="submit" disabled={isCreating}>
                                    {isCreating ? '저장 중...' : (editingLive ? '수정' : '추가')}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Lives List */}
            {lives.length === 0 ? (
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="py-12 text-center text-slate-400">
                        <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>등록된 라이브가 없습니다.</p>
                        <p className="text-sm mt-1">새 라이브를 추가해보세요.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {lives.map((live) => (
                        <Card key={live.id} className="bg-slate-800/50 border-slate-700">
                            <CardContent className="p-4">
                                <div className="flex gap-4">
                                    {/* Thumbnail */}
                                    <div className="w-40 h-24 bg-slate-700 rounded-lg overflow-hidden flex-shrink-0 relative">
                                        <img
                                            src={live.thumbnail_url || `https://img.youtube.com/vi/${live.youtube_id}/hqdefault.jpg`}
                                            alt={live.title}
                                            className="w-full h-full object-cover"
                                        />
                                        {live.is_live && (
                                            <Badge className="absolute top-2 left-2 bg-red-500 text-white animate-pulse">
                                                🔴 LIVE
                                            </Badge>
                                        )}
                                        {live.duration && (
                                            <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 text-white text-xs rounded">
                                                {live.duration}
                                            </span>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-semibold text-white truncate">{live.title}</h3>
                                        {live.description && (
                                            <p className="text-sm text-slate-400 line-clamp-2 mt-1">{live.description}</p>
                                        )}
                                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {formatDate(live.scheduled_at)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Eye className="w-3.5 h-3.5" />
                                                {live.view_count}회
                                            </span>
                                            <span className="text-slate-600">ID: {live.youtube_id}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-2">
                                        <Button
                                            size="sm"
                                            variant={live.is_live ? "destructive" : "default"}
                                            onClick={() => handleToggleLive(live.id, live.is_live)}
                                        >
                                            {live.is_live ? '라이브 종료' : '라이브 시작'}
                                        </Button>
                                        <div className="flex gap-2">
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                onClick={() => handleOpenEdit(live)}
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="outline"
                                                onClick={() => handleDelete(live.id)}
                                                className="text-red-400 hover:text-red-300"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
