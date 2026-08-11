import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import type { PropsWithChildren } from 'react';
import type { NavItem } from '@/types/navigation';

const navigation: NavItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Orders', href: '/dashboard/orders' },
    { title: 'Products', href: '/dashboard/products' },
    { title: 'Settings', href: '/dashboard/settings' },
];

export default function DashboardLayout({ children }: PropsWithChildren) {
    const { url, props } = usePage<any>();
    const user = props.auth?.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const isActive = (href: string | { url?: string } | undefined) => {
        if (!href) {
            return false;
        }

        const path = typeof href === 'string' ? href : (href.url ?? '');

        if (path === '/dashboard') {
            return url === '/dashboard';
        }

        return url.startsWith(path);
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                >
                    -
                </div>
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-gray-200 bg-white transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex h-16 items-center justify-center border-b border-gray-200 px-4">
                    <span className="text-xl font-bold text-blue-600">
                        Dashboard
                    </span>
                </div>

                <nav className="flex-1 space-y-1 px-3 py-4">
                    {navigation.map((item) => {
                        const active = isActive(item.href);
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.title}
                                href={item.href}
                                className={`group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                                    active
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                            >
                                {Icon ? (
                                    <Icon
                                        className={`mr-3 h-5 w-5 shrink-0 ${
                                            active
                                                ? 'text-blue-700'
                                                : 'text-gray-400 group-hover:text-gray-500'
                                        }`}
                                    />
                                ) : null}
                                {item.title}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sidebar Footer (Logout) */}
                <div className="border-t border-gray-200 p-4">
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="group flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                    >
                        Sign Out
                    </Link>
                </div>
            </aside>

            <div className="flex flex-1 flex-col overflow-hidden">
                <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center">
                        <button
                            type="button"
                            className="text-gray-500 hover:text-gray-700 focus:outline-none lg:hidden"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <span className="sr-only">Open sidebar</span>
                        </button>

                        <h1 className="ml-4 text-xl font-semibold text-gray-800 lg:ml-0">
                            Dashboard
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-sm font-medium text-gray-700">
                            {user?.name || 'Administrator'}
                        </div>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
