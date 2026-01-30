/**
 * Cloudflare Stream TUS 업로드 초기화 API
 * POST /api/stream/upload
 */

import { NextRequest, NextResponse } from 'next/server'

const CF_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID
const CF_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN

export async function POST(request: NextRequest) {
    try {
        // TODO: 관리자 인증 확인

        const body = await request.json()
        const { filename, filesize } = body

        if (!filename || !filesize) {
            return NextResponse.json(
                { error: 'filename and filesize are required' },
                { status: 400 }
            )
        }

        // Cloudflare Stream Direct Creator Upload 요청
        // https://developers.cloudflare.com/stream/uploading-videos/direct-creator-uploads/
        const response = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/stream?direct_user=true`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${CF_API_TOKEN}`,
                    'Tus-Resumable': '1.0.0',
                    'Upload-Length': filesize.toString(),
                    'Upload-Metadata': `filename ${Buffer.from(filename).toString('base64')}`,
                },
            }
        )

        if (!response.ok) {
            const errorData = await response.json()
            console.error('[Stream Upload Init] Error:', errorData)
            return NextResponse.json(
                { error: 'Failed to initialize upload' },
                { status: response.status }
            )
        }

        // Location 헤더에서 업로드 URL 추출
        const uploadUrl = response.headers.get('Location')
        const streamMediaId = response.headers.get('stream-media-id')

        if (!uploadUrl || !streamMediaId) {
            return NextResponse.json(
                { error: 'Missing upload URL or media ID' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            uploadUrl,
            videoUid: streamMediaId,
        })

    } catch (error) {
        console.error('[Stream Upload Init] Exception:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
