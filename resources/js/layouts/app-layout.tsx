import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { logout } from '@/routes';
import { useCart } from '@/store/cart-store';
import BookOpenIcon from '@iconify-react/lucide/book-open';
import LayoutDashboardIcon from '@iconify-react/lucide/layout-dashboard';
import LogOutIcon from '@iconify-react/lucide/log-out';
import MenuIcon from '@iconify-react/lucide/menu';
import ReceiptIcon from '@iconify-react/lucide/receipt';
import ShoppingBagIcon from '@iconify-react/lucide/shopping-bag';
import XIcon from '@iconify-react/lucide/x';

export default function AppLayout({ children }: { children: ReactNode }) {
    const { url, props } = usePage();
    const user = props.auth?.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { items } = useCart();

    const totalCartItems = items.reduce(
        (sum, item) => sum + (item.quantity || 0),
        0,
    );

    const isActive = (href: string) => {
        if (href === '/') {
            return url === '/';
        }
        return url.startsWith(href);
    };

    return (
        <div className="flex min-h-screen w-full flex-col bg-gray-50">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-xs transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-gray-200 bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex h-16 items-center justify-between border-b border-gray-100 px-6">
                    <Link
                        href="/order"
                        onClick={() => setSidebarOpen(false)}
                        className="flex items-center gap-2.5 font-black tracking-tight text-gray-900 text-xl"
                    >
                        <span>Kasa</span>
                    </Link>
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(false)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none"
                    >
                        <span className="sr-only">Close sidebar</span>
                        <XIcon className="h-5 w-5" />
                    </button>
                </div>

                <nav className="flex-1 space-y-1.5 px-4 py-6">
                    <Link
                        href="/order"
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                            isActive('/order')
                                ? 'bg-blue-50 text-blue-700 shadow-xs'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                    >
                        <BookOpenIcon
                            className={`h-5 w-5 ${isActive('/order') ? 'text-blue-700' : 'text-gray-400'}`}
                        />
                        <span>Menu & Order</span>
                    </Link>

                    <Link
                        href="/invoice"
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                            isActive('/invoice')
                                ? 'bg-blue-50 text-blue-700 shadow-xs'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                    >
                        <ReceiptIcon
                            className={`h-5 w-5 ${isActive('/invoice') ? 'text-blue-700' : 'text-gray-400'}`}
                        />
                        <span>My Orders</span>
                    </Link>
                </nav>

                <div className="border-t border-gray-200 p-4">
                    {user ? (
                        <div className="space-y-2">
                            <div className="flex items-center gap-3 px-3 py-2">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold text-white shadow-xs">
                                    {user.name?.charAt(0) || 'U'}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-bold text-gray-900">
                                        {user.name}
                                    </p>
                                    <p className="truncate text-xs text-gray-500">
                                        {user.email}
                                    </p>
                                </div>
                            </div>
                            <Link
                                href="/dashboard"
                                onClick={() => setSidebarOpen(false)}
                                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                            >
                                <LayoutDashboardIcon className="h-4 w-4 text-gray-500" />
                                <span>Dashboard</span>
                            </Link>
                            <Link
                                href={logout.url()}
                                method="post"
                                as="button"
                                onClick={() => setSidebarOpen(false)}
                                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                            >
                                <LogOutIcon className="h-4 w-4 text-red-600" />
                                <span>Sign Out</span>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <Link
                                href="/auth/login"
                                onClick={() => setSidebarOpen(false)}
                                className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-700 active:scale-95"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/auth/register"
                                onClick={() => setSidebarOpen(false)}
                                className="flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50 active:scale-95"
                            >
                                Create Account
                            </Link>
                        </div>
                    )}
                </div>
            </aside>

            <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-4 shadow-xs sm:px-6">
                <div className="flex items-center gap-3 sm:gap-4">
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(true)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 focus:outline-none"
                    >
                        <span className="sr-only">Open side navbar</span>
                        <MenuIcon className="h-6 w-6" />
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href="/order/view-order"
                        className="relative flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3.5 py-2 text-sm font-bold text-gray-800 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 active:scale-95 shadow-2xs"
                    >
                        <div className="relative flex items-center justify-center">
                            <ShoppingBagIcon className="h-5 w-5 text-gray-700" />
                            {totalCartItems > 0 && (
                                <span className="absolute -top-1.5 -right-2 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-black text-white shadow-xs">
                                    {totalCartItems}
                                </span>
                            )}
                        </div>
                        <span className="hidden sm:inline">Cart</span>
                    </Link>

                    {user ? (
                        <Link
                            href="/dashboard"
                            className="hidden items-center gap-2 rounded-full border border-gray-200 bg-white p-1 pr-3 text-xs font-bold text-gray-700 shadow-2xs transition hover:bg-gray-50 sm:flex"
                        >
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                                {user.name?.charAt(0) || 'U'}
                            </div>
                            <span className="max-w-[100px] truncate">
                                {user.name}
                            </span>
                        </Link>
                    ) : (
                        <Link
                            href="/auth/login"
                            className="hidden rounded-full bg-gray-900 px-4 py-2 text-xs font-bold text-white transition hover:bg-gray-800 active:scale-95 sm:block"
                        >
                            Sign In
                        </Link>
                    )}
                </div>
            </header>

            <main className="flex-1 w-full">{children}</main>
        </div>
    );
}
