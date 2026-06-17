export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <header className="bg-gray-800 text-white">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-lg font-semibold">Dashboard</h1>
                </div>
            </header>
            <main className="grow bg-gray-100 p-4">{children}</main>
        </div>
    );
}
