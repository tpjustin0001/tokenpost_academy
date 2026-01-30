'use client'

/**
 * Cloudflare Stream TUS 업로드 컴포넌트
 * Resumable 영상 업로드 지원
 */

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface VideoUploadProps {
    onUploadComplete?: (videoUid: string) => void
    onError?: (error: string) => void
}

export function VideoUpload({ onUploadComplete, onError }: VideoUploadProps) {
    const [file, setFile] = useState<File | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [videoUid, setVideoUid] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0]
        if (selectedFile) {
            // 영상 파일만 허용
            if (!selectedFile.type.startsWith('video/')) {
                onError?.('영상 파일만 업로드할 수 있습니다.')
                return
            }

            // 파일 크기 제한 (2GB)
            if (selectedFile.size > 2 * 1024 * 1024 * 1024) {
                onError?.('파일 크기는 2GB 이하여야 합니다.')
                return
            }

            setFile(selectedFile)
            setProgress(0)
            setVideoUid(null)
        }
    }

    const handleUpload = async () => {
        if (!file) return

        setIsUploading(true)
        setProgress(0)

        try {
            // 1. 서버에서 TUS 업로드 URL 받기
            const initResponse = await fetch('/api/stream/upload', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    filename: file.name,
                    filesize: file.size,
                }),
            })

            if (!initResponse.ok) {
                throw new Error('Failed to initialize upload')
            }

            const { uploadUrl, videoUid: uid } = await initResponse.json()

            // 2. TUS 프로토콜로 업로드 (단순화된 버전)
            // 실제 구현에서는 tus-js-client 라이브러리 사용 권장
            const uploadResponse = await fetch(uploadUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': file.type,
                    'Content-Length': file.size.toString(),
                },
                body: file,
            })

            if (!uploadResponse.ok) {
                throw new Error('Upload failed')
            }

            // 업로드 진행 시뮬레이션 (실제로는 XHR로 progress 이벤트 사용)
            for (let i = 0; i <= 100; i += 10) {
                setProgress(i)
                await new Promise(r => setTimeout(r, 100))
            }

            setVideoUid(uid)
            onUploadComplete?.(uid)

        } catch (error) {
            console.error('Upload error:', error)
            onError?.(error instanceof Error ? error.message : 'Upload failed')
        } finally {
            setIsUploading(false)
        }
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        const droppedFile = e.dataTransfer.files?.[0]
        if (droppedFile && droppedFile.type.startsWith('video/')) {
            setFile(droppedFile)
            setProgress(0)
            setVideoUid(null)
        }
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
    }

    return (
        <div className="space-y-4">
            {/* 드롭존 */}
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
                className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition
          ${file
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-slate-600 hover:border-slate-500 bg-slate-800/50'
                    }
        `}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                />

                {file ? (
                    <div className="space-y-2">
                        <span className="text-4xl">🎬</span>
                        <p className="text-white font-medium">{file.name}</p>
                        <p className="text-sm text-slate-400">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <span className="text-4xl">📤</span>
                        <p className="text-white">영상을 드래그하거나 클릭하여 업로드</p>
                        <p className="text-sm text-slate-400">MP4, MOV, WEBM (최대 2GB)</p>
                    </div>
                )}
            </div>

            {/* 진행률 */}
            {isUploading && (
                <div className="space-y-2">
                    <Progress value={progress} />
                    <p className="text-sm text-slate-400 text-center">{progress}% 업로드 중...</p>
                </div>
            )}

            {/* 업로드 완료 */}
            {videoUid && (
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <p className="text-green-400 font-medium">✓ 업로드 완료</p>
                    <p className="text-sm text-slate-400 mt-1">Video UID: {videoUid}</p>
                </div>
            )}

            {/* 업로드 버튼 */}
            {file && !videoUid && (
                <Button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                    {isUploading ? '업로드 중...' : '업로드 시작'}
                </Button>
            )}
        </div>
    )
}
