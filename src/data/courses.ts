/**
 * 강의 데이터 - TokenPost Academy
 * 7개 Phase로 구성된 체계적인 커리큘럼
 */

export interface Lesson {
    id: string
    title: string
    titleEn?: string
    duration: string
    isFreePreview?: boolean
    isCompleted?: boolean
}

export interface Section {
    id: string
    title: string
    lessons: Lesson[]
}

export interface Course {
    id: string
    slug: string
    phase: number
    title: string
    subtitle: string
    description: string
    level: string
    duration: string
    lessonsCount: number
    isFree: boolean
    gradient: string
    sections: Section[]
}

// Phase 1: The Foundation (기초와 진입)
export const PHASE_1: Course = {
    id: 'phase-1',
    slug: 'foundation',
    phase: 1,
    title: 'The Foundation',
    subtitle: '기초와 진입',
    description: '암호화폐의 본질을 이해하고, 안전하게 자산을 보관하며, 첫 매수를 실행하는 단계입니다. 가장 중요하지만 간과하기 쉬운 보안과 세금 문제를 먼저 다룹니다.',
    level: '입문',
    duration: '약 3시간',
    lessonsCount: 17,
    isFree: false,
    gradient: 'from-emerald-500 to-teal-600',
    sections: [
        {
            id: '1-1',
            title: 'Welcome & Setup',
            lessons: [
                { id: '1-1-1', title: '강의 소개 및 방향성', titleEn: 'Course Intro', duration: '3:07', isFreePreview: true },
                { id: '1-1-2', title: '수강생 혜택 및 자료 활용법', titleEn: 'Member Resources & Discounts', duration: '5:00' },
                { id: '1-1-3', title: '커뮤니티 참여 방법', titleEn: 'How to Join TokenPost Community', duration: '4:30' },
            ],
        },
        {
            id: '1-2',
            title: 'Understanding the Assets (자산의 이해)',
            lessons: [
                { id: '1-2-1', title: '코인의 존재 이유와 철학', titleEn: 'Why do Coins Exist?', duration: '6:11' },
                { id: '1-2-2', title: '비트코인 등 가치 저장 수단', titleEn: 'Store of Value Coins', duration: '10:33' },
                { id: '1-2-3', title: '이더리움, 솔라나 등 플랫폼 코인', titleEn: 'Smart Contract Chains', duration: '11:44' },
                { id: '1-2-4', title: '기축 통화 역할을 하는 스테이블 코인', titleEn: 'Stablecoins', duration: '15:21' },
                { id: '1-2-5', title: '다양한 섹터별 코인 개요', titleEn: 'Oracles, Privacy, Memes, Exchange Tokens', duration: '12:00' },
                { id: '1-2-6', title: '비트코인이 왜 자산인가?', titleEn: 'Bitcoin is an Asset Class', duration: '38:23' },
            ],
        },
        {
            id: '1-3',
            title: 'Security & Wallets (필수 보안 및 지갑)',
            lessons: [
                { id: '1-3-1', title: '해킹당하지 않는 법 (가장 중요)', titleEn: 'Wallet Security ⚠️', duration: '8:15' },
                { id: '1-3-2', title: '지갑의 원리와 주소 체계', titleEn: 'Crypto Wallet Basics & Addresses', duration: '7:00' },
                { id: '1-3-3', title: '핫월렛과 콜드월렛의 차이', titleEn: 'Hot Wallets vs Cold Wallets', duration: '8:23' },
                { id: '1-3-4', title: '메타마스크 실전 사용법', titleEn: 'Using MetaMask', duration: '6:19' },
            ],
        },
        {
            id: '1-4',
            title: 'Onboarding (실전 진입)',
            lessons: [
                { id: '1-4-1', title: '투자 접근 방식', titleEn: 'How to Gain Exposure to Crypto Assets?', duration: '14:06' },
                { id: '1-4-2', title: '거래소와 기존 브로커 차이', titleEn: 'Crypto Exchanges vs Trad Brokers', duration: '8:00' },
                { id: '1-4-3', title: '입출금 실전', titleEn: 'How to Deposit & Cash Out', duration: '10:00' },
                { id: '1-4-4', title: '세금 및 절세 전략', titleEn: 'Crypto & Taxes', duration: '15:00' },
            ],
        },
    ],
}

// Phase 2: The Analyst (가치 평가와 분석)
export const PHASE_2: Course = {
    id: 'phase-2',
    slug: 'analyst',
    phase: 2,
    title: 'The Analyst',
    subtitle: '가치 평가와 분석',
    description: '"무엇을 살 것인가?"에 대한 답을 찾는 단계입니다. 뇌동매매를 멈추고 데이터(토크노믹스, 온체인)에 기반한 투자를 배웁니다.',
    level: '초급',
    duration: '약 2시간 30분',
    lessonsCount: 14,
    isFree: false,
    gradient: 'from-blue-500 to-indigo-600',
    sections: [
        {
            id: '2-1',
            title: 'Tokenomics (토크노믹스: 코인 경제학)',
            lessons: [
                { id: '2-1-1', title: '좋은 토크노믹스란 무엇인가?', titleEn: 'What are "Good" Tokenomics?', duration: '7:12', isFreePreview: true },
                { id: '2-1-2', title: '시가총액의 함정과 진실', titleEn: 'Market Capitalisation Explained', duration: '8:03' },
                { id: '2-1-3', title: '인플레이션과 락업 해제 물량', titleEn: 'Pre-mined Tokens and Inflation', duration: '9:11' },
                { id: '2-1-4', title: '소각과 스테이킹이 가격에 미치는 영향', titleEn: 'Token Burns & Staking', duration: '10:00' },
                { id: '2-1-5', title: '초기 투자 기회 분석', titleEn: 'ICOs, Launchpads and Launchpools', duration: '12:00' },
            ],
        },
        {
            id: '2-2',
            title: 'Onchain Analysis (온체인 데이터 분석)',
            lessons: [
                { id: '2-2-1', title: '블록체인 데이터 분석 입문', titleEn: 'Onchain Analysis Intro', duration: '8:00' },
                { id: '2-2-2', title: '이더스캔 등 탐색기 활용법', titleEn: 'How to Use a Blockchain Explorer', duration: '10:00' },
                { id: '2-2-3', title: '네트워크 건전성 지표', titleEn: 'Bitcoin Hashrate & Validators', duration: '9:00' },
                { id: '2-2-4', title: '저점과 고점 판별 (MVRV-Z)', titleEn: 'MVRV-Z: Ideal Timing Metric', duration: '12:00' },
                { id: '2-2-5', title: '공포와 탐욕 단계 확인 (NUPL)', titleEn: 'NUPL: Fear & Greed', duration: '10:00' },
                { id: '2-2-6', title: '시장 참여자들의 수익 구간 분석 (SOPR)', titleEn: 'SOPR: Profits & Losses', duration: '11:00' },
                { id: '2-2-7', title: '장기 투자자들의 움직임 추적', titleEn: 'HODL Waves & Realised Price', duration: '13:00' },
            ],
        },
    ],
}

// Phase 3: The Strategist (투자 전략과 포트폴리오)
export const PHASE_3: Course = {
    id: 'phase-3',
    slug: 'strategist',
    phase: 3,
    title: 'The Strategist',
    subtitle: '투자 전략과 포트폴리오',
    description: '분석한 코인으로 나만의 포트폴리오를 구성하고 관리하는 법을 배웁니다. 멘탈 관리와 리스크 관리가 핵심입니다.',
    level: '중급',
    duration: '약 1시간 30분',
    lessonsCount: 6,
    isFree: false,
    gradient: 'from-yellow-500 to-orange-600',
    sections: [
        {
            id: '3-1',
            title: 'Investment Strategy (투자 원칙)',
            lessons: [
                { id: '3-1-1', title: '리스크와 수익의 상관관계', titleEn: 'Risk & Return', duration: '8:38', isFreePreview: true },
                { id: '3-1-2', title: '인플레이션 헤징 수단으로서의 크립토', titleEn: 'The Devastating Consequences of Inflation', duration: '12:00' },
                { id: '3-1-3', title: '적립식 투자의 힘', titleEn: 'DCA (Dollar Cost Averaging)', duration: '3:09' },
                { id: '3-1-4', title: '포트폴리오 구성 실전', titleEn: 'How to Construct Your Investment Portfolio', duration: '18:00' },
                { id: '3-1-5', title: '현금 비중 조절과 레버리지 관리', titleEn: 'Cash, Debt & Investments', duration: '15:00' },
                { id: '3-1-6', title: '성장형 자산 vs 수익형 자산 배분', titleEn: 'Growth vs Income: My Thoughts', duration: '10:00' },
            ],
        },
    ],
}

// Phase 4: The Trader (테크니컬 분석과 트레이딩)
export const PHASE_4: Course = {
    id: 'phase-4',
    slug: 'trader',
    phase: 4,
    title: 'The Trader',
    subtitle: '테크니컬 분석과 트레이딩',
    description: '차트를 읽고 단기/중기 트레이딩을 통해 시장 수익률(Alpha)을 초과 달성하는 기술을 익힙니다.',
    level: '중급',
    duration: '약 2시간',
    lessonsCount: 10,
    isFree: false,
    gradient: 'from-orange-500 to-red-600',
    sections: [
        {
            id: '4-1',
            title: 'Technical Analysis (차트 분석)',
            lessons: [
                { id: '4-1-1', title: '로그 차트와 추세선 작도법', titleEn: 'Log Charts: How I Draw My "Chart of Truth"', duration: '11:14', isFreePreview: true },
                { id: '4-1-2', title: '캔들 패턴의 이해', titleEn: 'Candlestick Charts & Heikin Ashi', duration: '12:00' },
                { id: '4-1-3', title: '지지, 저항, 추세의 정석', titleEn: 'Support & Resistance, Trends', duration: '15:00' },
                { id: '4-1-4', title: '이동평균선과 보조지표 활용', titleEn: 'Moving Averages & Indicators', duration: '14:00' },
                { id: '4-1-5', title: '반전 패턴과 고점/저점 포착', titleEn: 'Reversal Patterns, Tops & Bottoms', duration: '13:00' },
            ],
        },
        {
            id: '4-2',
            title: 'Spot Trading Execution (실전 매매)',
            lessons: [
                { id: '4-2-1', title: '호가창 보는 법', titleEn: 'The Order Book & Spread', duration: '8:00' },
                { id: '4-2-2', title: '지정가와 시장가의 차이와 수수료', titleEn: 'Maker vs Taker (Fees)', duration: '7:00' },
                { id: '4-2-3', title: '다양한 주문 방식 활용', titleEn: 'Order Types (Market, Limit, Stop, Iceberg, TWAP)', duration: '12:00' },
                { id: '4-2-4', title: '라이브 트레이딩 시연', titleEn: 'Live Trading Tuition', duration: '6:45' },
            ],
        },
    ],
}

// Phase 5: The DeFi User (탈중앙화 금융)
export const PHASE_5: Course = {
    id: 'phase-5',
    slug: 'defi',
    phase: 5,
    title: 'The DeFi User',
    subtitle: '탈중앙화 금융',
    description: '코인을 단순히 들고 있는 것을 넘어, 탈중앙화 금융(DeFi)을 통해 이자 수익(Yield)을 창출하는 법을 배웁니다.',
    level: '중급',
    duration: '약 1시간',
    lessonsCount: 5,
    isFree: false,
    gradient: 'from-purple-500 to-pink-600',
    sections: [
        {
            id: '5-1',
            title: 'DeFi Fundamentals',
            lessons: [
                { id: '5-1-1', title: '패시브 인컴 창출 전략', titleEn: '3 Ways to Earn Crypto Passive Income', duration: '7:26', isFreePreview: true },
                { id: '5-1-2', title: '탈중앙화 거래소의 원리', titleEn: 'DEXs Explained (Order Book vs AMM)', duration: '12:00' },
                { id: '5-1-3', title: '유동성 공급과 이자 농사', titleEn: 'Liquidity Pools & Yield Farming', duration: '15:00' },
                { id: '5-1-4', title: '비영구적 손실의 위험성과 계산법', titleEn: 'Divergence (Impermanent) Loss', duration: '7:01' },
                { id: '5-1-5', title: '대출과 청산 리스크 관리', titleEn: 'Lending & Borrowing (LTV, Liquidation)', duration: '14:00' },
            ],
        },
    ],
}

// Phase 6: The Professional (선물과 옵션)
export const PHASE_6: Course = {
    id: 'phase-6',
    slug: 'professional',
    phase: 6,
    title: 'The Professional',
    subtitle: '선물과 옵션 - 심화',
    description: '하락장에서도 수익을 내거나(Short), 포트폴리오를 방어(Hedging)하는 고급 파생상품 기술을 다룹니다. (초보자 진입 금지 구간)',
    level: '고급',
    duration: '약 2시간 30분',
    lessonsCount: 13,
    isFree: false,
    gradient: 'from-red-500 to-rose-600',
    sections: [
        {
            id: '6-1',
            title: 'Futures Trading (선물 거래)',
            lessons: [
                { id: '6-1-1', title: '레버리지 경고 ⚠️', titleEn: 'Leverage & Margin Risk Warning', duration: '1:34' },
                { id: '6-1-2', title: '선물 시장 구조와 펀딩비의 이해', titleEn: 'Crypto Futures Intro & Funding Rates', duration: '12:00' },
                { id: '6-1-3', title: '교차와 격리 마진의 차이', titleEn: 'Cross vs Isolated Margin', duration: '10:00' },
                { id: '6-1-4', title: '손절 원칙', titleEn: 'Stop Loss Strategies', duration: '15:00' },
                { id: '6-1-5', title: '적정 포지션 규모 산정', titleEn: 'Position Size Calculation', duration: '12:00' },
                { id: '6-1-6', title: '청산가 계산과 레버리지 조절', titleEn: 'Leverage & Liquidations', duration: '14:00' },
            ],
        },
        {
            id: '6-2',
            title: 'Options Trading (옵션 거래)',
            lessons: [
                { id: '6-2-1', title: '옵션의 기초 (콜/풋)', titleEn: 'Intro to Derivatives & Options Basics', duration: '15:00' },
                { id: '6-2-2', title: '옵션 매수 전략', titleEn: 'Buying Options (Long Call/Put)', duration: '12:00' },
                { id: '6-2-3', title: '옵션 매도 전략', titleEn: 'Writing Options (Covered Calls, Selling Puts)', duration: '14:00' },
                { id: '6-2-4', title: '스프레드 전략', titleEn: 'Bull Call Spreads / Bear Put Spreads', duration: '16:00' },
                { id: '6-2-5', title: '하락장 방어 전략 (보험)', titleEn: 'Protective Puts', duration: '10:00' },
            ],
        },
    ],
}

// Phase 7: The Macro Master (거시 경제와 시장 사이클)
export const PHASE_7: Course = {
    id: 'phase-7',
    slug: 'macro',
    phase: 7,
    title: 'The Macro Master',
    subtitle: '거시 경제와 시장 사이클',
    description: "나무가 아닌 숲을 보는 단계입니다. 지난 시장의 업데이트 기록들을 'Case Study'로 활용하여 시장 사이클을 읽는 눈을 기릅니다.",
    level: '고급',
    duration: '약 2시간',
    lessonsCount: 5,
    isFree: false,
    gradient: 'from-slate-600 to-slate-800',
    sections: [
        {
            id: '7-1',
            title: 'Macro Analysis Framework',
            lessons: [
                { id: '7-1-1', title: '글로벌 유동성과 크립토의 관계', titleEn: 'What is the Denominator? (Liquidity)', duration: '18:00', isFreePreview: true },
                { id: '7-1-2', title: '반감기 사이클 분석', titleEn: 'Bitcoin Halving & Cycles', duration: '20:00' },
            ],
        },
        {
            id: '7-2',
            title: 'Case Studies (과거 분석 복기)',
            lessons: [
                { id: '7-2-1', title: '시가총액 투영으로 보는 성장 가능성', titleEn: 'How Crypto Can Go 10x', duration: '25:00' },
                { id: '7-2-2', title: '역사적 고점/저점 분석 복기', titleEn: 'Bitcoin Realised Price vs True Market Mean', duration: '18:00' },
                { id: '7-2-3', title: '시기별 포트폴리오 변화 과정 학습', titleEn: 'My Portfolio Updates (Series)', duration: '30:00' },
            ],
        },
    ],
}

// 전체 코스 목록
export const ALL_COURSES: Course[] = [
    PHASE_1,
    PHASE_2,
    PHASE_3,
    PHASE_4,
    PHASE_5,
    PHASE_6,
    PHASE_7,
]

// 코스 slug로 찾기
export function getCourseBySlug(slug: string): Course | undefined {
    return ALL_COURSES.find(c => c.slug === slug)
}

// 전체 레슨 수 계산
export function getTotalLessons(): number {
    return ALL_COURSES.reduce((acc, course) => acc + course.lessonsCount, 0)
}

// 전체 강의 시간 (대략)
export function getTotalDuration(): string {
    return '약 15시간'
}
