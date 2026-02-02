'use client'

/**
 * 사용자 관리 페이지
 * 사용자 목록 조회, 필터링, 권한 관리
 */

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
    getUsers,
    updateUser,
    banUser,
    unbanUser,
    getUserStats,
    type User
} from '@/actions/users'

function getSubscriptionBadge(level: string) {
    switch (level) {
        case 'free':
            return <Badge className="bg-slate-500/20 text-slate-400 border border-slate-500/30">🆓 무료</Badge>
        case 'plus':
            return <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30">⭐ Plus</Badge>
        case 'alpha':
            return <Badge className="bg-purple-500/20 text-purple-400 border border-purple-500/30">👑 Alpha</Badge>
        default:
            return null
    }
}

function getRoleBadge(role: string) {
    switch (role) {
        case 'admin':
            return <Badge className="bg-red-500/20 text-red-400 border border-red-500/30">🛡️ 관리자</Badge>
        case 'student':
            return <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">📚 학생</Badge>
        default:
            return null
    }
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([])
    const [totalCount, setTotalCount] = useState(0)
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({ total: 0, free: 0, plus: 0, alpha: 0 })

    // 필터 상태
    const [search, setSearch] = useState('')
    const [subscriptionFilter, setSubscriptionFilter] = useState<string>('all')
    const [roleFilter, setRoleFilter] = useState<string>('all')

    // 수정 다이얼로그
    const [editingUser, setEditingUser] = useState<User | null>(null)
    const [editSubscription, setEditSubscription] = useState<'free' | 'plus' | 'alpha'>('free')
    const [editRole, setEditRole] = useState<'student' | 'admin'>('student')
    const [saving, setSaving] = useState(false)

    // 정지 다이얼로그
    const [banningUser, setBanningUser] = useState<User | null>(null)
    const [banReason, setBanReason] = useState('')

    useEffect(() => {
        loadUsers()
        loadStats()
    }, [subscriptionFilter, roleFilter])

    const loadUsers = async () => {
        setLoading(true)
        const filters: any = {}
        if (subscriptionFilter !== 'all') filters.subscription_level = subscriptionFilter
        if (roleFilter !== 'all') filters.role = roleFilter
        if (search) filters.search = search

        const result = await getUsers(filters)
        setUsers(result.users)
        setTotalCount(result.count)
        setLoading(false)
    }

    const loadStats = async () => {
        const result = await getUserStats()
        setStats(result)
    }

    const handleSearch = () => {
        loadUsers()
    }

    const openEditDialog = (user: User) => {
        setEditingUser(user)
        setEditSubscription(user.subscription_level)
        setEditRole(user.role)
    }

    const handleSaveUser = async () => {
        if (!editingUser) return
        setSaving(true)

        await updateUser(editingUser.id, {
            subscription_level: editSubscription,
            role: editRole
        })

        await loadUsers()
        await loadStats()
        setEditingUser(null)
        setSaving(false)
    }

    const handleBanUser = async () => {
        if (!banningUser) return
        setSaving(true)

        await banUser(banningUser.id, banReason)

        await loadUsers()
        setBanningUser(null)
        setBanReason('')
        setSaving(false)
    }

    const handleUnbanUser = async (user: User) => {
        setSaving(true)
        await unbanUser(user.id)
        await loadUsers()
        setSaving(false)
    }

    return (
        <div className="p-6 space-y-6">
            {/* 페이지 헤더 */}
            <div>
                <h1 className="text-3xl font-bold text-white">사용자 관리</h1>
                <p className="text-slate-400 mt-1">아카데미 사용자 목록과 권한을 관리합니다.</p>
            </div>

            {/* 통계 카드 */}
            <div className="grid grid-cols-4 gap-4">
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-white">{stats.total}</div>
                        <div className="text-sm text-slate-400">전체 사용자</div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-slate-400">{stats.free}</div>
                        <div className="text-sm text-slate-500">🆓 무료</div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-blue-400">{stats.plus}</div>
                        <div className="text-sm text-slate-500">⭐ Plus</div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-800/50 border-slate-700">
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-purple-400">{stats.alpha}</div>
                        <div className="text-sm text-slate-500">👑 Alpha</div>
                    </CardContent>
                </Card>
            </div>

            {/* 필터 & 검색 */}
            <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="pt-6">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="이메일 또는 닉네임 검색..."
                                className="bg-slate-700 border-slate-600 text-white"
                            />
                        </div>
                        <Select value={subscriptionFilter} onValueChange={setSubscriptionFilter}>
                            <SelectTrigger className="w-40 bg-slate-700 border-slate-600 text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700">
                                <SelectItem value="all">전체 구독</SelectItem>
                                <SelectItem value="free">🆓 무료</SelectItem>
                                <SelectItem value="plus">⭐ Plus</SelectItem>
                                <SelectItem value="alpha">👑 Alpha</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={roleFilter} onValueChange={setRoleFilter}>
                            <SelectTrigger className="w-40 bg-slate-700 border-slate-600 text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700">
                                <SelectItem value="all">전체 역할</SelectItem>
                                <SelectItem value="student">📚 학생</SelectItem>
                                <SelectItem value="admin">🛡️ 관리자</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button onClick={handleSearch}>검색</Button>
                    </div>
                </CardContent>
            </Card>

            {/* 사용자 목록 테이블 */}
            <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                    <CardTitle className="text-white">
                        사용자 목록 ({totalCount}명)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="py-12 text-center text-slate-400">로딩 중...</div>
                    ) : users.length === 0 ? (
                        <div className="py-12 text-center text-slate-400">
                            사용자가 없습니다
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="border-slate-700">
                                    <TableHead className="text-slate-400">사용자</TableHead>
                                    <TableHead className="text-slate-400">구독</TableHead>
                                    <TableHead className="text-slate-400">역할</TableHead>
                                    <TableHead className="text-slate-400">상태</TableHead>
                                    <TableHead className="text-slate-400">가입일</TableHead>
                                    <TableHead className="text-slate-400 w-32"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id} className="border-slate-700">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-white font-medium">
                                                    {user.nickname?.[0] || user.email[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="text-white font-medium">
                                                        {user.nickname || '이름 없음'}
                                                    </div>
                                                    <div className="text-sm text-slate-400">{user.email}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{getSubscriptionBadge(user.subscription_level)}</TableCell>
                                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                                        <TableCell>
                                            {user.is_banned ? (
                                                <Badge className="bg-red-500/20 text-red-400 border border-red-500/30">
                                                    🚫 정지됨
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                                    ✅ 활성
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-slate-400">
                                            {new Date(user.created_at).toLocaleDateString('ko-KR')}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => openEditDialog(user)}
                                                >
                                                    수정
                                                </Button>
                                                {user.is_banned ? (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-emerald-400"
                                                        onClick={() => handleUnbanUser(user)}
                                                    >
                                                        해제
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-red-400"
                                                        onClick={() => setBanningUser(user)}
                                                    >
                                                        정지
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* 수정 다이얼로그 */}
            <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
                <DialogContent className="bg-slate-800 border-slate-700">
                    <DialogHeader>
                        <DialogTitle className="text-white">사용자 수정</DialogTitle>
                    </DialogHeader>
                    {editingUser && (
                        <div className="space-y-4 pt-4">
                            <div className="text-white mb-4">
                                {editingUser.nickname || editingUser.email}
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-300">구독 등급</Label>
                                <Select value={editSubscription} onValueChange={(v: any) => setEditSubscription(v)}>
                                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-slate-700">
                                        <SelectItem value="free">🆓 무료</SelectItem>
                                        <SelectItem value="plus">⭐ Plus</SelectItem>
                                        <SelectItem value="alpha">👑 Alpha</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-300">역할</Label>
                                <Select value={editRole} onValueChange={(v: any) => setEditRole(v)}>
                                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-slate-700">
                                        <SelectItem value="student">📚 학생</SelectItem>
                                        <SelectItem value="admin">🛡️ 관리자</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex gap-2 pt-4">
                                <Button
                                    onClick={handleSaveUser}
                                    disabled={saving}
                                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
                                >
                                    {saving ? '저장 중...' : '저장'}
                                </Button>
                                <DialogClose asChild>
                                    <Button variant="outline" className="flex-1">취소</Button>
                                </DialogClose>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* 정지 다이얼로그 */}
            <Dialog open={!!banningUser} onOpenChange={(open) => !open && setBanningUser(null)}>
                <DialogContent className="bg-slate-800 border-slate-700">
                    <DialogHeader>
                        <DialogTitle className="text-white">사용자 계정 정지</DialogTitle>
                    </DialogHeader>
                    {banningUser && (
                        <div className="space-y-4 pt-4">
                            <div className="text-white mb-2">
                                <span className="text-red-400 font-medium">{banningUser.nickname || banningUser.email}</span>
                                님의 계정을 정지합니다.
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-300">정지 사유</Label>
                                <Input
                                    value={banReason}
                                    onChange={(e) => setBanReason(e.target.value)}
                                    placeholder="정지 사유를 입력하세요"
                                    className="bg-slate-700 border-slate-600 text-white"
                                />
                            </div>
                            <div className="flex gap-2 pt-4">
                                <Button
                                    onClick={handleBanUser}
                                    disabled={saving || !banReason.trim()}
                                    className="flex-1 bg-red-600 hover:bg-red-700"
                                >
                                    {saving ? '처리 중...' : '계정 정지'}
                                </Button>
                                <DialogClose asChild>
                                    <Button variant="outline" className="flex-1">취소</Button>
                                </DialogClose>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
