'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from '@/components/ui/button'
import { Menu, BookOpen, LayoutDashboard, Home, Video } from 'lucide-react'
import { usePathname } from 'next/navigation'

// SVG 아이콘 컴포넌트
const Icons = {
    home: <Home className="w-5 h-5" />,
    courses: <BookOpen className="w-5 h-5" />,
    live: <Video className="w-5 h-5" />,
    progress: <LayoutDashboard className="w-5 h-5" />,
}

const SIDEBAR_MENU = [
    { icon: Icons.home, label: '홈', href: '/' },
    { icon: Icons.courses, label: '전체 강의', href: '/courses' },
    { icon: Icons.live, label: '라이브', href: '/live' },
    { icon: Icons.progress, label: '내 학습', href: '/dashboard' },
]

type MobileNavProps = {
    courses?: {
        id: string
        title: string
        slug: string
        phase: number
        modules: {
            id: string
            title: string
            lessons: {
                id: string
                title: string
            }[]
        }[]
    }[]
    user?: any
}

import { logout } from '@/actions/auth'

export function MobileNav({ courses = [], user }: MobileNavProps) {
    const [open, setOpen] = React.useState(false)
    const pathname = usePathname()

    const handleLogout = async () => {
        await logout()
        setOpen(false)
    }

    // 현재 강의 찾기
    const currentCourseSlug = pathname?.split('/')[2]
    const isCoursePage = pathname?.startsWith('/courses/') && !!currentCourseSlug
    const currentCourse = isCoursePage ? courses.find(c => c.slug === currentCourseSlug) : null

    return (
        <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur border-b border-border z-50 px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="-ml-2">
                            <Menu className="h-6 w-6" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0 flex flex-col">
                        <SheetHeader className="h-20 px-6 flex items-center border-b border-border shrink-0">
                            <Link href="/" className="flex items-center gap-3 w-full" onClick={() => setOpen(false)}>
                                <div className="relative w-8 h-8">
                                    <Image
                                        src="/images/tokenpost-emblem.png"
                                        alt="TokenPost Academy"
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                                <div className="flex flex-col items-start">
                                    <span className="font-semibold tracking-tight text-foreground">TokenPost</span>
                                    <span className="text-xs text-muted-foreground -mt-0.5">Academy</span>
                                </div>
                            </Link>
                            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                        </SheetHeader>

                        <Tabs defaultValue={isCoursePage ? "curriculum" : "menu"} className="flex-1 flex flex-col w-full">
                            <div className="px-6 py-2 border-b border-border">
                                <TabsList className="w-full grid grid-cols-2">
                                    <TabsTrigger value="menu">메뉴</TabsTrigger>
                                    <TabsTrigger value="curriculum" disabled={!isCoursePage}>
                                        강의 목차
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            <div className="flex-1 overflow-y-auto">
                                <TabsContent value="menu" className="m-0 py-4 px-3 space-y-1">
                                    {SIDEBAR_MENU.map((item) => {
                                        const isActive = pathname === item.href
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setOpen(false)}
                                                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200
                                        ${isActive
                                                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                                                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                                                    }`}
                                            >
                                                <div className={`w-5 h-5 ${isActive ? 'text-white' : 'text-muted-foreground'}`}>
                                                    {item.icon}
                                                </div>
                                                {item.label}
                                            </Link>
                                        )
                                    })}

                                    {/* User Auth Section (Mobile) */}
                                    <div className="mt-4 px-3 pt-4 border-t border-border">
                                        {user ? (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3 px-2">
                                                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg font-bold">
                                                        {user.nickname?.[0] || user.name?.[0] || 'U'}
                                                    </div>
                                                    <div className="flex flex-col overflow-hidden">
                                                        <span className="text-sm font-semibold truncate">{user.nickname || user.name}</span>
                                                        <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                                                    </div>
                                                </div>
                                                <Button
                                                    onClick={handleLogout}
                                                    variant="outline"
                                                    className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 border-border"
                                                >
                                                    로그아웃
                                                </Button>
                                            </div>
                                        ) : (
                                            <Link href="/login" onClick={() => setOpen(false)}>
                                                <Button className="w-full bg-slate-900 dark:bg-white dark:text-black hover:bg-slate-800">
                                                    로그인
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                </TabsContent>

                                <TabsContent value="curriculum" className="m-0 py-2">
                                    {currentCourse ? (
                                        <div className="px-4 pb-10">
                                            <h3 className="font-bold text-lg mb-4 px-2">{currentCourse.title}</h3>
                                            <Accordion type="multiple" className="w-full" defaultValue={currentCourse.modules.map(m => m.id)}>
                                                {currentCourse.modules.map((module: any) => (
                                                    <AccordionItem key={module.id} value={module.id} className="border-b border-border/50">
                                                        <AccordionTrigger className="hover:no-underline py-3 text-sm font-semibold text-foreground px-2">
                                                            {module.title}
                                                        </AccordionTrigger>
                                                        <AccordionContent className="pb-2">
                                                            <div className="flex flex-col space-y-1 pl-2">
                                                                {module.lessons.map((lesson: any) => {
                                                                    const isLessonActive = pathname === `/courses/${currentCourse.slug}/lesson/${lesson.id}`
                                                                    return (
                                                                        <Link
                                                                            key={lesson.id}
                                                                            href={`/courses/${currentCourse.slug}/lesson/${lesson.id}`}
                                                                            onClick={() => setOpen(false)}
                                                                            className={`flex items-center gap-3 py-2.5 px-3 rounded-md text-sm transition-colors
                                                                    ${isLessonActive
                                                                                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-medium'
                                                                                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                                                                                }`}
                                                                        >
                                                                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isLessonActive ? 'bg-blue-600 dark:bg-blue-400' : 'bg-slate-300 dark:bg-slate-700'}`} />
                                                                            <span className="truncate">{lesson.title}</span>
                                                                        </Link>
                                                                    )
                                                                })}
                                                            </div>
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                ))}
                                            </Accordion>
                                        </div>
                                    ) : (
                                        <div className="p-8 text-center text-muted-foreground text-sm">
                                            현재 수강 중인 강의가 없습니다.
                                        </div>
                                    )}
                                </TabsContent>
                            </div>
                        </Tabs>
                    </SheetContent>
                </Sheet>

                <Link href="/" className="flex items-center gap-2">
                    <span className="font-semibold text-lg tracking-tight">TokenPost Academy</span>
                </Link>
            </div>
        </div>
    )
}
