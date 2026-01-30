export default function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-slate-900">
            {/* TODO: GNB (Global Navigation Bar) 추가 */}
            <main>{children}</main>
            {/* TODO: Footer 추가 */}
        </div>
    )
}
