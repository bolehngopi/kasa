import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />
            <div className="p-4">
                <h1 className="mb-4 text-2xl font-bold">Dashboard</h1>
                <p>
                    Welcome to the dashboard! Here you can find an overview of
                    your data and recent activity.
                </p>
            </div>
        </>
    );
}
