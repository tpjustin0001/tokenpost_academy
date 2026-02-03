'use server'

/**
 * Vimeo oEmbed API를 사용하여 비디오 정보를 가져옵니다.
 */
export async function getVimeoVideoInfo(urlOrId: string) {
    try {
        let videoUrl = urlOrId
        // ID만 입력된 경우 URL로 변환
        if (/^\d+$/.test(urlOrId)) {
            videoUrl = `https://vimeo.com/${urlOrId}`
        }

        const oembedUrl = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(videoUrl)}`

        // 도메인 제한된 영상도 가져올 수 있도록 Referer 헤더 추가
        const referer = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

        const response = await fetch(oembedUrl, {
            headers: {
                'Referer': referer
            }
        })

        if (!response.ok) {
            console.error('Failed to fetch vimeo info:', response.statusText)
            return { success: false, error: 'Vimeo 정보를 가져오는데 실패했습니다.' }
        }

        const data = await response.json()

        return {
            success: true,
            data: {
                title: data.title,
                duration: formatDuration(data.duration),
                description: data.description,
                thumbnail_url: data.thumbnail_url,
                video_id: data.video_id?.toString()
            }
        }
    } catch (error) {
        console.error('Error in getVimeoVideoInfo:', error)
        return { success: false, error: 'Vimeo API 호출 중 오류가 발생했습니다.' }
    }
}

function formatDuration(seconds: number): string {
    const min = Math.floor(seconds / 60)
    const sec = seconds % 60
    return `${min}:${sec.toString().padStart(2, '0')}`
}
