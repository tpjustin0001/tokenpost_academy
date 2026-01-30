/**
 * Cloudflare Stream API Wrapper
 * 🔐 이 파일은 서버 사이드에서만 실행됩니다.
 * 절대 클라이언트에 노출하지 마세요.
 */

const CF_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN!
const CF_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID!

interface SignedTokenOptions {
  /** 토큰 유효 기간 (초). 기본값: 3600 (1시간) */
  exp?: number
  /** IP 바인딩 (선택사항) */
  userIp?: string
}

interface CloudflareTokenResponse {
  success: boolean
  result: {
    token: string
  }
  errors: Array<{ message: string }>
}

/**
 * Cloudflare Stream Signed Token 생성
 * @param videoUid - Cloudflare Stream Video ID
 * @param options - 토큰 옵션
 * @returns 서명된 토큰 문자열
 */
export async function generateSignedToken(
  videoUid: string,
  options: SignedTokenOptions = {}
): Promise<string> {
  const { exp = 3600, userIp } = options

  const body: Record<string, unknown> = {
    exp: Math.floor(Date.now() / 1000) + exp,
  }

  // 선택적 IP 바인딩
  if (userIp) {
    body.accessRules = [
      { type: 'ip', action: 'allow', ip: [userIp] }
    ]
  }

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/stream/${videoUid}/token`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CF_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  )

  const data: CloudflareTokenResponse = await response.json()

  if (!data.success) {
    console.error('[Cloudflare Stream] Token generation failed:', data.errors)
    throw new Error('Failed to generate video token')
  }

  return data.result.token
}

/**
 * Cloudflare Stream 영상 정보 조회
 * @param videoUid - Cloudflare Stream Video ID
 */
export async function getVideoDetails(videoUid: string) {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/stream/${videoUid}`,
    {
      headers: {
        'Authorization': `Bearer ${CF_API_TOKEN}`,
      },
    }
  )

  const data = await response.json()

  if (!data.success) {
    throw new Error('Failed to get video details')
  }

  return data.result
}

/**
 * Cloudflare Stream Player URL 생성
 * @param token - 서명된 토큰
 * @returns HLS 스트리밍 URL
 */
export function getStreamUrl(token: string): string {
  // Customer subdomain은 Cloudflare Dashboard에서 확인 가능
  const customerSubdomain = process.env.CLOUDFLARE_CUSTOMER_SUBDOMAIN || 'customer-xxx'
  return `https://${customerSubdomain}.cloudflarestream.com/${token}/manifest/video.m3u8`
}
