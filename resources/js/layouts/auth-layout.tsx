import type { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen w-full flex-col bg-gray-50">
            {children}
        </div>
    );
}
