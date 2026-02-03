'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { getNote, saveNote } from '@/actions/note'
import { Loader2, Check } from 'lucide-react'
import { toast } from 'sonner'

interface UserNotepadProps {
    lessonId: string
}

export function UserNotepad({ lessonId }: UserNotepadProps) {
    const [content, setContent] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [lastSaved, setLastSaved] = useState<Date | null>(null)
    const [authStatus, setAuthStatus] = useState<{ isLoggedIn: boolean; hasMembership: boolean } | null>(null)

    // Debounce Timer
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Load initial note & auth check
    useEffect(() => {
        let isMounted = true
        async function load() {
            try {
                // 1. Check Auth Status first
                // 동적 import로 순환 참조 방지
                const { getUserStatus } = await import('@/actions/user')
                const status = await getUserStatus()

                if (isMounted) setAuthStatus(status)

                if (!status.isLoggedIn || !status.hasMembership) {
                    setIsLoading(false)
                    return
                }

                // 2. Fetch Note only if authorized
                const noteContent = await getNote(lessonId)
                if (isMounted) {
                    setContent(noteContent || '')
                }
            } catch (error) {
                console.error(error)
                toast.error('노트를 불러오지 못했습니다.')
            } finally {
                if (isMounted) setIsLoading(false)
            }
        }
        load()
        return () => { isMounted = false }
    }, [lessonId])

    const handleSave = useCallback(async (newContent: string) => {
        setIsSaving(true)
        try {
            await saveNote(lessonId, newContent)
            setLastSaved(new Date())
        } catch (error) {
            console.error(error)
            toast.error('노트 저장 실패')
        } finally {
            setIsSaving(false)
        }
    }, [lessonId])

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newContent = e.target.value
        setContent(newContent)

        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)

        saveTimeoutRef.current = setTimeout(() => {
            handleSave(newContent)
        }, 1500)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault()
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
            handleSave(content)
        }
    }

    if (isLoading) {
        return <div className="h-64 flex items-center justify-center text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            노트 로딩 중...
        </div>
    }

    // Access Control UI
    if (authStatus && !authStatus.isLoggedIn) {
        return (
            <div className="h-[400px] flex flex-col items-center justify-center bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 p-6 text-center">
                <span className="text-4xl mb-4">🔒</span>
                <h3 className="font-semibold text-lg mb-2">로그인이 필요합니다</h3>
                <p className="text-muted-foreground text-sm mb-6">나만의 강의 노트를 작성하려면 로그인을 해주세요.</p>
                <a href="/login" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                    로그인하기
                </a>
            </div>
        )
    }

    if (authStatus && !authStatus.hasMembership) {
        return (
            <div className="h-[400px] flex flex-col items-center justify-center bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 p-6 text-center">
                <span className="text-4xl mb-4">💎</span>
                <h3 className="font-semibold text-lg mb-2">멤버십 전용 기능입니다</h3>
                <p className="text-muted-foreground text-sm mb-6 max-w-xs mx-auto">강의 노트 기능은 Plus 멤버십 이상 회원님들께 제공됩니다.</p>
                <button disabled className="px-4 py-2 bg-slate-300 dark:bg-slate-700 text-slate-500 rounded-lg text-sm font-medium cursor-not-allowed">
                    멤버십 업그레이드 (준비중)
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground px-1">
                <span>자유롭게 메모하세요 (자동 저장됨)</span>
                <div className="flex items-center gap-2 h-5">
                    {isSaving ? (
                        <span className="flex items-center text-blue-500">
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                            저장 중...
                        </span>
                    ) : lastSaved ? (
                        <span className="flex items-center text-emerald-500 transition-opacity duration-1000">
                            <Check className="w-3 h-3 mr-1" />
                            저장됨 ({lastSaved.toLocaleTimeString()})
                        </span>
                    ) : null}
                </div>
            </div>

            <Textarea
                value={content}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="이 강의에서 배운 내용을 기록해보세요..."
                className="min-h-[400px] text-base leading-relaxed resize-none p-6 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus:border-blue-500 transition-colors"
                spellCheck={false}
            />

            <p className="text-xs text-muted-foreground text-right pt-2">
                * Ctrl+S를 눌러 즉시 저장할 수 있습니다.
            </p>
        </div>
    )
}
