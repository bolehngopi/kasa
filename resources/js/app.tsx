import { createInertiaApp } from '@inertiajs/react';
import AppLayout from './layouts/app-layout';
import DashboardLayout from './layouts/dashboard-layout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} | ${appName}` : appName),
    strictMode: true,
    layout: (name) => {
        switch (true) {
            case name === 'welcome':
                return null;
            case name.startsWith('dashboard/'):
                return DashboardLayout;
            default:
                return AppLayout;
        }
    },
    progress: {
        color: '#4B5563',
    },
});
