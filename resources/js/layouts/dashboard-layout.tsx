import { Link } from '@inertiajs/react';
import { dashboard } from '@/routes';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <header className="bg-gray-800 text-white">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-lg font-semibold">
                        <Link
                            href={dashboard.url()}
                            className="text-white hover:text-gray-300"
                        >
                            Dashboard
                        </Link>
                    </h1>
                </div>
            </header>
            <main className="grow bg-gray-100 p-4">{children}</main>
        </div>
    );
}
