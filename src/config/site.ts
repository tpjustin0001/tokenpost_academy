/**
 * 사이트 설정
 */

export const siteConfig = {
    name: 'TokenPost Academy',
    description: 'Web3 커리어의 시작, 토큰포스트 아카데미',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://academy.tokenpost.kr',

    // 네비게이션 링크
    navLinks: [
        { label: '강의', href: '/courses' },
        { label: '내 강의실', href: '/dashboard' },
    ],

    // 푸터 링크
    footerLinks: [
        { label: '이용약관', href: '/terms' },
        { label: '개인정보처리방침', href: '/privacy' },
        { label: '토큰포스트', href: 'https://www.tokenpost.kr', external: true },
    ],

    // 소셜 링크
    social: {
        twitter: 'https://twitter.com/tokenpost_korea',
        telegram: 'https://t.me/tokenpost',
    },

    // SEO 기본값
    seo: {
        title: {
            default: 'TokenPost Academy - Web3 Learning Platform',
            template: '%s | TokenPost Academy',
        },
        description: 'Web3 전문 온라인 학습 플랫폼. 블록체인, 암호화폐, DeFi, NFT 등 실무 중심 강의를 제공합니다.',
        keywords: ['Web3', '블록체인', '암호화폐', 'DeFi', 'NFT', '온라인 강의', 'LMS'],
        openGraph: {
            type: 'website',
            locale: 'ko_KR',
            siteName: 'TokenPost Academy',
        },
    },
}

export type SiteConfig = typeof siteConfig
