import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoginButton } from '@/components/auth/LoginButton'

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
            <Card className="w-full max-w-md bg-slate-800/50 border-slate-700">
                <CardHeader className="text-center space-y-2">
                    <div className="mx-auto mb-4">
                        {/* 로고 플레이스홀더 */}
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <span className="text-2xl font-bold text-white">TP</span>
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold text-white">
                        TokenPost Academy
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                        Web3 커리어의 시작, 토큰포스트 아카데미
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <LoginButton className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                            토큰포스트 계정으로 시작하기
                        </LoginButton>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-600" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-slate-800 px-2 text-slate-500">
                                기존 토큰포스트 계정으로 로그인
                            </span>
                        </div>
                    </div>

                    <p className="text-center text-sm text-slate-500">
                        토큰포스트 구독자 회원이라면 별도 가입 없이
                        <br />
                        바로 수강 신청이 가능합니다.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}

