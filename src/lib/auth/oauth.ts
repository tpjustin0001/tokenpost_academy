/**
 * TokenPost OAuth 2.0 + PKCE Configuration
 * login_logic_spec.md 문서 기반 구현
 */

// OAuth 설정
export const OAUTH_CONFIG = {
    // 토큰포스트 OAuth 서버
    AUTH_URL: 'https://www.tokenpost.kr/oauth/login',  // 사용자 로그인 페이지
    TOKEN_ENDPOINT: 'https://oapi.tokenpost.kr/oauth/v1/token', // 서버 사이드 토큰 교환
    USER_INFO_ENDPOINT: 'https://oapi.tokenpost.kr/oauth/v1/userInfo', // 서버 사이드 정보 조회

    // 내부 API 라우트 (프록시)
    TOKEN_URL: '/api/oauth/token',
    USER_INFO_URL: '/api/oauth/userinfo',

    // 클라이언트 설정
    CLIENT_ID: process.env.NEXT_PUBLIC_TP_CLIENT_ID || 'SaOvfXcB39qBajLd5wTpMg14X6k9HdCi',
    REDIRECT_URI: process.env.NEXT_PUBLIC_REDIRECT_URI || 'https://academy.tokenpost.kr/callback',

    // OAuth Scopes
    SCOPE: 'email,nickname,grade,uid,point.tpc,subscription',
    USER_INFO_SCOPE: 'user.email,user.nickname,grade,uid,point.tpc,subscription', // UserInfo에서 요청할 스코프 (user. prefix 필요)
}

/**
 * PKCE Code Verifier 생성 (43-128자 랜덤 문자열)
 */
export function generateCodeVerifier(): string {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return base64UrlEncode(array)
}

/**
 * PKCE Code Challenge 생성 (SHA-256 해시)
 */
export async function generateCodeChallenge(verifier: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(verifier)
    const hash = await crypto.subtle.digest('SHA-256', data)
    return base64UrlEncode(new Uint8Array(hash))
}

/**
 * State 파라미터 생성 (CSRF 방지)
 */
export function generateState(): string {
    const array = new Uint8Array(16)
    crypto.getRandomValues(array)
    return base64UrlEncode(array)
}

/**
 * Base64 URL-safe 인코딩
 */
function base64UrlEncode(buffer: Uint8Array): string {
    const base64 = btoa(String.fromCharCode(...buffer))
    return base64
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '')
}

/**
 * 로그인 URL 생성
 */
export async function buildAuthorizationUrl(): Promise<{
    url: string
    state: string
    codeVerifier: string
}> {
    const state = generateState()
    const codeVerifier = generateCodeVerifier()
    const codeChallenge = await generateCodeChallenge(codeVerifier)

    const params = new URLSearchParams({
        response_type: 'code',
        client_id: OAUTH_CONFIG.CLIENT_ID,
        redirect_uri: OAUTH_CONFIG.REDIRECT_URI,
        scope: OAUTH_CONFIG.SCOPE.replace(/,/g, ' '), // 스페이스로 구분
        state: state,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
    })

    const url = `${OAUTH_CONFIG.AUTH_URL}?${params.toString()}`
    console.log('[OAuth] Generated Auth URL:', url)

    return {
        url,
        state,
        codeVerifier,
    }
}

/**
 * 토큰 교환 요청
 */
export async function exchangeToken(
    code: string,
    codeVerifier: string
): Promise<{
    access_token: string
    refresh_token?: string
    expires_in: number
}> {
    const response = await fetch(OAUTH_CONFIG.TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            code,
            code_verifier: codeVerifier,
            client_id: OAUTH_CONFIG.CLIENT_ID,
            redirect_uri: OAUTH_CONFIG.REDIRECT_URI,
            grant_type: 'authorization_code',
        }),
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('Token exchange failed details:', errorData)
        throw new Error(errorData.error_description || errorData.error || 'Token exchange failed')
    }

    return response.json()
}

/**
 * 사용자 정보 조회
 */
export async function fetchUserInfo(accessToken: string): Promise<{
    email: string
    nickname: string
    uid: string
    grade?: string
    point?: any // 상세 구조는 서버 응답에 따름
    subscription?: any
}> {
    const response = await fetch(
        `${OAUTH_CONFIG.USER_INFO_URL}?scope=${OAUTH_CONFIG.USER_INFO_SCOPE}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    )

    if (!response.ok) {
        throw new Error('Failed to fetch user info')
    }

    const data = await response.json()

    // Normalize data structure
    return {
        uid: data.user?.uuid || data.sub,
        email: data.user?.email,
        nickname: data.user?.nickname,
        grade: data.grade?.code, // e.g. "BronzeIV"
        point: data.point,
        subscription: data.subscription
    }
}
