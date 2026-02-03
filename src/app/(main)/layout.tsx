import { ThemeToggle } from '@/components/layout/ThemeToggle'

export default function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            <header className="sticky top-0 z-30 flex items-center justify-end h-16 px-8 bg-background/80 backdrop-blur-xl border-b border-border transition-colors duration-300">
                <ThemeToggle />
            </header>
            <main className="relative">{children}</main>
        </div>
    )
}
