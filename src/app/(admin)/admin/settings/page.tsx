'use client'

/**
 * Admin 설정 페이지
 * 사이트 설정 및 관리자 권한 관리
 */

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

export default function AdminSettingsPage() {
    const [saving, setSaving] = useState(false)
    const [settings, setSettings] = useState({
        siteName: 'TokenPost Academy',
        siteDescription: '웹3와 크립토를 제대로 배우는 곳',
        contactEmail: 'support@tokenpost.kr',
        enableRegistration: true,
        enableFreeTrial: true,
        maintenanceMode: false,
        maintenanceMessage: '서비스 점검 중입니다. 잠시 후 다시 시도해주세요.',
        adminEmails: 'admin@tokenpost.kr',
    })

    const handleSave = async () => {
        setSaving(true)
        // TODO: Supabase settings 테이블에 저장
        console.log('Saving settings:', settings)
        await new Promise(resolve => setTimeout(resolve, 500))
        setSaving(false)
        alert('설정이 저장되었습니다!')
    }

    return (
        <div className="p-6 space-y-6 max-w-4xl">
            {/* 페이지 헤더 */}
            <div>
                <h1 className="text-3xl font-bold text-white">설정</h1>
                <p className="text-slate-400 mt-1">사이트 설정 및 관리 옵션</p>
            </div>

            {/* 기본 설정 */}
            <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                    <CardTitle className="text-white">🏠 기본 설정</CardTitle>
                    <CardDescription className="text-slate-400">
                        사이트 기본 정보를 관리합니다
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-slate-300">사이트 이름</Label>
                        <Input
                            value={settings.siteName}
                            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                            className="bg-slate-700 border-slate-600 text-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-slate-300">사이트 설명</Label>
                        <Textarea
                            value={settings.siteDescription}
                            onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                            className="bg-slate-700 border-slate-600 text-white resize-none"
                            rows={2}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-slate-300">문의 이메일</Label>
                        <Input
                            value={settings.contactEmail}
                            onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                            className="bg-slate-700 border-slate-600 text-white"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* 가입 설정 */}
            <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                    <CardTitle className="text-white">👥 가입 설정</CardTitle>
                    <CardDescription className="text-slate-400">
                        회원 가입 및 무료 체험 옵션
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white font-medium">회원 가입 허용</p>
                            <p className="text-sm text-slate-400">새로운 사용자가 가입할 수 있습니다</p>
                        </div>
                        <Switch
                            checked={settings.enableRegistration}
                            onCheckedChange={(checked) => setSettings({ ...settings, enableRegistration: checked })}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white font-medium">무료 체험 활성화</p>
                            <p className="text-sm text-slate-400">신규 가입자에게 무료 체험 기간 제공</p>
                        </div>
                        <Switch
                            checked={settings.enableFreeTrial}
                            onCheckedChange={(checked) => setSettings({ ...settings, enableFreeTrial: checked })}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* 점검 모드 */}
            <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                    <CardTitle className="text-white">🔧 점검 모드</CardTitle>
                    <CardDescription className="text-slate-400">
                        사이트 점검 시 사용자 접근을 제한합니다
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-white font-medium">점검 모드 활성화</p>
                            <p className="text-sm text-slate-400">관리자를 제외한 모든 사용자 접근 차단</p>
                        </div>
                        <Switch
                            checked={settings.maintenanceMode}
                            onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
                        />
                    </div>
                    {settings.maintenanceMode && (
                        <div className="space-y-2">
                            <Label className="text-slate-300">점검 메시지</Label>
                            <Textarea
                                value={settings.maintenanceMessage}
                                onChange={(e) => setSettings({ ...settings, maintenanceMessage: e.target.value })}
                                className="bg-slate-700 border-slate-600 text-white resize-none"
                                rows={2}
                            />
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* 관리자 권한 */}
            <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                    <CardTitle className="text-white">🛡️ 관리자 권한</CardTitle>
                    <CardDescription className="text-slate-400">
                        관리자 페이지에 접근할 수 있는 이메일을 관리합니다
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-slate-300">관리자 이메일 (줄바꿈으로 구분)</Label>
                        <Textarea
                            value={settings.adminEmails}
                            onChange={(e) => setSettings({ ...settings, adminEmails: e.target.value })}
                            placeholder="admin@example.com&#10;manager@example.com"
                            className="bg-slate-700 border-slate-600 text-white resize-none"
                            rows={4}
                        />
                        <p className="text-xs text-slate-500">
                            각 줄에 하나의 이메일을 입력하세요. 해당 이메일로 로그인한 사용자만 관리자 페이지에 접근할 수 있습니다.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* 저장 버튼 */}
            <div className="flex justify-end">
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                    {saving ? '저장 중...' : '설정 저장'}
                </Button>
            </div>
        </div>
    )
}
