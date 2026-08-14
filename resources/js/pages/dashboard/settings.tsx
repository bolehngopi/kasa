import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface UserData {
    id: number;
    name: string;
    email: string;
    phone_number?: string | null;
}

interface SettingsData {
    store_name: string;
    store_phone: string;
    store_address: string;
    currency_symbol: string;
    tax_percentage: string;
    service_charge_percentage: string;
    receipt_header: string;
    receipt_footer: string;
}

interface Props {
    user: UserData;
    canManageStore: boolean;
    settings: SettingsData;
}

export default function Settings({ user, canManageStore, settings }: Props) {
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;
    const [activeTab, setActiveTab] = useState<'profile' | 'store' | 'financial' | 'receipt'>('profile');

    // Profile Form State
    const profileForm = useForm({
        name: user?.name || '',
        email: user?.email || '',
        phone_number: user?.phone_number || '',
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });

    // Store Settings Form State
    const storeForm = useForm<SettingsData>({
        store_name: settings?.store_name || 'Kasa Coffee & Eatery',
        store_phone: settings?.store_phone || '+62 812-3456-7890',
        store_address: settings?.store_address || 'Jl. Sudirman No. 123, Jakarta',
        currency_symbol: settings?.currency_symbol || 'Rp',
        tax_percentage: settings?.tax_percentage || '11',
        service_charge_percentage: settings?.service_charge_percentage || '5',
        receipt_header: settings?.receipt_header || 'Thank you for visiting Kasa!',
        receipt_footer: settings?.receipt_footer || 'Free Wi-Fi: KasaGuest | Pass: kopi123',
    });

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        profileForm.put('/dashboard/settings/profile', {
            preserveScroll: true,
            onSuccess: () => {
                profileForm.reset('current_password', 'new_password', 'new_password_confirmation');
            },
        });
    };

    const handleStoreSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        storeForm.put('/dashboard/settings/store', {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Account & Store Settings" />

            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage your user account details and store configurations.
                    </p>
                </div>
            </div>

            {flash?.success && (
                <div className="mb-6 flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800 shadow-sm">
                    <div className="flex items-center gap-2">
                        <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{flash.success}</span>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Form Navigation & Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Navigation Tabs */}
                    <div className="flex space-x-1 rounded-xl border border-gray-200 bg-white p-1 shadow-sm overflow-x-auto">
                        <button
                            type="button"
                            onClick={() => setActiveTab('profile')}
                            className={`flex-1 min-w-[110px] rounded-lg py-2.5 text-sm font-medium transition ${
                                activeTab === 'profile'
                                    ? 'bg-blue-600 text-white shadow'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                        >
                            My Profile
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('store')}
                            className={`flex-1 min-w-[110px] rounded-lg py-2.5 text-sm font-medium transition flex items-center justify-center gap-1.5 ${
                                activeTab === 'store'
                                    ? 'bg-blue-600 text-white shadow'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                        >
                            Store Profile
                            {!canManageStore && (
                                <svg className="h-3.5 w-3.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('financial')}
                            className={`flex-1 min-w-[110px] rounded-lg py-2.5 text-sm font-medium transition flex items-center justify-center gap-1.5 ${
                                activeTab === 'financial'
                                    ? 'bg-blue-600 text-white shadow'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                        >
                            Financial & Tax
                            {!canManageStore && (
                                <svg className="h-3.5 w-3.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => setActiveTab('receipt')}
                            className={`flex-1 min-w-[110px] rounded-lg py-2.5 text-sm font-medium transition flex items-center justify-center gap-1.5 ${
                                activeTab === 'receipt'
                                    ? 'bg-blue-600 text-white shadow'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                        >
                            Receipt Template
                            {!canManageStore && (
                                <svg className="h-3.5 w-3.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* Tab 0: User Personal Profile (Available to All Staff/Users) */}
                    {activeTab === 'profile' && (
                        <form onSubmit={handleProfileSubmit} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-5">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">User Profile Settings</h3>
                                <p className="text-xs text-gray-500">Update your personal account details and login password.</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="user_name" className="block text-sm font-medium text-gray-700">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="user_name"
                                        type="text"
                                        value={profileForm.data.name}
                                        onChange={(e) => profileForm.setData('name', e.target.value)}
                                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        placeholder="Your full name"
                                    />
                                    {profileForm.errors.name && <p className="mt-1 text-xs text-red-600">{profileForm.errors.name}</p>}
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="user_email" className="block text-sm font-medium text-gray-700">
                                            Email Address <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="user_email"
                                            type="email"
                                            value={profileForm.data.email}
                                            onChange={(e) => profileForm.setData('email', e.target.value)}
                                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            placeholder="user@example.com"
                                        />
                                        {profileForm.errors.email && <p className="mt-1 text-xs text-red-600">{profileForm.errors.email}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="user_phone" className="block text-sm font-medium text-gray-700">
                                            Phone Number
                                        </label>
                                        <input
                                            id="user_phone"
                                            type="text"
                                            value={profileForm.data.phone_number}
                                            onChange={(e) => profileForm.setData('phone_number', e.target.value)}
                                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            placeholder="+62 812-0000-0000"
                                        />
                                        {profileForm.errors.phone_number && <p className="mt-1 text-xs text-red-600">{profileForm.errors.phone_number}</p>}
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-4 space-y-4">
                                    <h4 className="text-sm font-medium text-gray-900">Change Password (Optional)</h4>

                                    <div>
                                        <label htmlFor="current_password" className="block text-xs font-medium text-gray-700">
                                            Current Password
                                        </label>
                                        <input
                                            id="current_password"
                                            type="password"
                                            value={profileForm.data.current_password}
                                            onChange={(e) => profileForm.setData('current_password', e.target.value)}
                                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            placeholder="Enter your current password"
                                        />
                                        {profileForm.errors.current_password && <p className="mt-1 text-xs text-red-600">{profileForm.errors.current_password}</p>}
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div>
                                            <label htmlFor="new_password" className="block text-xs font-medium text-gray-700">
                                                New Password
                                            </label>
                                            <input
                                                id="new_password"
                                                type="password"
                                                value={profileForm.data.new_password}
                                                onChange={(e) => profileForm.setData('new_password', e.target.value)}
                                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                placeholder="Min. 8 characters"
                                            />
                                            {profileForm.errors.new_password && <p className="mt-1 text-xs text-red-600">{profileForm.errors.new_password}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="new_password_confirmation" className="block text-xs font-medium text-gray-700">
                                                Confirm New Password
                                            </label>
                                            <input
                                                id="new_password_confirmation"
                                                type="password"
                                                value={profileForm.data.new_password_confirmation}
                                                onChange={(e) => profileForm.setData('new_password_confirmation', e.target.value)}
                                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                placeholder="Repeat new password"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-end border-t border-gray-100 pt-4">
                                <button
                                    type="submit"
                                    disabled={profileForm.processing}
                                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {profileForm.processing ? 'Updating Profile...' : 'Save Profile Details'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Store & Receipt Forms (Requires 'manage store' Role/Permission) */}
                    {activeTab !== 'profile' && !canManageStore && (
                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center shadow-sm">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h3 className="mt-3 text-base font-semibold text-amber-900">Restricted Access</h3>
                            <p className="mt-1 text-sm text-amber-700 max-w-md mx-auto">
                                You do not have permission to modify store configuration. Please contact a manager with the <strong>"manage store"</strong> role to request access.
                            </p>
                        </div>
                    )}

                    {activeTab !== 'profile' && canManageStore && (
                        <form onSubmit={handleStoreSubmit} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                            {/* Tab 1: Store Info */}
                            {activeTab === 'store' && (
                                <div className="space-y-5">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Store Profile</h3>
                                        <p className="text-xs text-gray-500">General information displayed on invoices and customer receipts.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="store_name" className="block text-sm font-medium text-gray-700">
                                                Store Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                id="store_name"
                                                type="text"
                                                value={storeForm.data.store_name}
                                                onChange={(e) => storeForm.setData('store_name', e.target.value)}
                                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                placeholder="e.g. Kasa Coffee & Eatery"
                                            />
                                            {storeForm.errors.store_name && <p className="mt-1 text-xs text-red-600">{storeForm.errors.store_name}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="store_phone" className="block text-sm font-medium text-gray-700">
                                                Store Phone Number
                                            </label>
                                            <input
                                                id="store_phone"
                                                type="text"
                                                value={storeForm.data.store_phone}
                                                onChange={(e) => storeForm.setData('store_phone', e.target.value)}
                                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                placeholder="e.g. +62 812-3456-7890"
                                            />
                                            {storeForm.errors.store_phone && <p className="mt-1 text-xs text-red-600">{storeForm.errors.store_phone}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="store_address" className="block text-sm font-medium text-gray-700">
                                                Store Address
                                            </label>
                                            <textarea
                                                id="store_address"
                                                rows={3}
                                                value={storeForm.data.store_address}
                                                onChange={(e) => storeForm.setData('store_address', e.target.value)}
                                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                placeholder="e.g. Jl. Sudirman No. 123, Jakarta"
                                            />
                                            {storeForm.errors.store_address && <p className="mt-1 text-xs text-red-600">{storeForm.errors.store_address}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Tab 2: Financial & Tax */}
                            {activeTab === 'financial' && (
                                <div className="space-y-5">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Financial & Tax Rates</h3>
                                        <p className="text-xs text-gray-500">Configure regional currency and checkout surcharge metrics.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="currency_symbol" className="block text-sm font-medium text-gray-700">
                                                Currency Symbol <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                id="currency_symbol"
                                                type="text"
                                                value={storeForm.data.currency_symbol}
                                                onChange={(e) => storeForm.setData('currency_symbol', e.target.value)}
                                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:w-40"
                                                placeholder="e.g. Rp or $"
                                            />
                                            {storeForm.errors.currency_symbol && <p className="mt-1 text-xs text-red-600">{storeForm.errors.currency_symbol}</p>}
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div>
                                                <label htmlFor="tax_percentage" className="block text-sm font-medium text-gray-700">
                                                    Tax / VAT Rate (%) <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative mt-1">
                                                    <input
                                                        id="tax_percentage"
                                                        type="number"
                                                        step="0.1"
                                                        min="0"
                                                        max="100"
                                                        value={storeForm.data.tax_percentage}
                                                        onChange={(e) => storeForm.setData('tax_percentage', e.target.value)}
                                                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 pr-8 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    />
                                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-gray-400">
                                                        %
                                                    </span>
                                                </div>
                                                {storeForm.errors.tax_percentage && <p className="mt-1 text-xs text-red-600">{storeForm.errors.tax_percentage}</p>}
                                            </div>

                                            <div>
                                                <label htmlFor="service_charge_percentage" className="block text-sm font-medium text-gray-700">
                                                    Service Charge (%) <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative mt-1">
                                                    <input
                                                        id="service_charge_percentage"
                                                        type="number"
                                                        step="0.1"
                                                        min="0"
                                                        max="100"
                                                        value={storeForm.data.service_charge_percentage}
                                                        onChange={(e) => storeForm.setData('service_charge_percentage', e.target.value)}
                                                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 pr-8 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    />
                                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-gray-400">
                                                        %
                                                    </span>
                                                </div>
                                                {storeForm.errors.service_charge_percentage && (
                                                    <p className="mt-1 text-xs text-red-600">{storeForm.errors.service_charge_percentage}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Tab 3: Receipt Template */}
                            {activeTab === 'receipt' && (
                                <div className="space-y-5">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">Receipt Customization</h3>
                                        <p className="text-xs text-gray-500">Custom messages printed at the top and bottom of customer bills.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="receipt_header" className="block text-sm font-medium text-gray-700">
                                                Receipt Header Text
                                            </label>
                                            <input
                                                id="receipt_header"
                                                type="text"
                                                value={storeForm.data.receipt_header}
                                                onChange={(e) => storeForm.setData('receipt_header', e.target.value)}
                                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                placeholder="e.g. Thank you for visiting us!"
                                            />
                                            {storeForm.errors.receipt_header && <p className="mt-1 text-xs text-red-600">{storeForm.errors.receipt_header}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="receipt_footer" className="block text-sm font-medium text-gray-700">
                                                Receipt Footer Text / Wi-Fi Note
                                            </label>
                                            <textarea
                                                id="receipt_footer"
                                                rows={3}
                                                value={storeForm.data.receipt_footer}
                                                onChange={(e) => storeForm.setData('receipt_footer', e.target.value)}
                                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                placeholder="e.g. Free Wi-Fi: KasaGuest | Pass: kopi123"
                                            />
                                            {storeForm.errors.receipt_footer && <p className="mt-1 text-xs text-red-600">{storeForm.errors.receipt_footer}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Save Button Footer */}
                            <div className="mt-6 flex items-center justify-end border-t border-gray-100 pt-4">
                                <button
                                    type="submit"
                                    disabled={storeForm.processing}
                                    className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {storeForm.processing ? 'Saving Changes...' : 'Save Store Settings'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Live Preview Card */}
                <div className="space-y-4">
                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                        <h3 className="mb-2 text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                            <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Receipt Live Preview
                        </h3>

                        {/* Mock Thermal Receipt */}
                        <div className="rounded-lg border border-dashed border-gray-300 bg-amber-50/40 p-4 text-xs font-mono text-gray-800 shadow-inner">
                            <div className="text-center space-y-1 pb-3 border-b border-dashed border-gray-300">
                                <p className="font-bold text-sm tracking-wide text-gray-900">{storeForm.data.store_name || 'STORE NAME'}</p>
                                <p className="text-[11px] text-gray-600">{storeForm.data.store_address || 'Store Address'}</p>
                                <p className="text-[11px] text-gray-600">{storeForm.data.store_phone || 'Phone Number'}</p>
                                {storeForm.data.receipt_header && <p className="pt-1 italic text-[10px] text-gray-500">{storeForm.data.receipt_header}</p>}
                            </div>

                            <div className="py-3 border-b border-dashed border-gray-300 space-y-1">
                                <div className="flex justify-between">
                                    <span>ORDER #KS-1002</span>
                                    <span>14:20</span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                    <span>Table: 04</span>
                                    <span>Dine-In</span>
                                </div>
                            </div>

                            <div className="py-3 border-b border-dashed border-gray-300 space-y-1.5">
                                <div className="flex justify-between">
                                    <span>1x Iced Cappuccino</span>
                                    <span>{storeForm.data.currency_symbol || 'Rp'} 30,000</span>
                                </div>
                                <div className="flex justify-between text-gray-500 text-[10px] pl-2">
                                    <span>+ Oat Milk</span>
                                    <span>{storeForm.data.currency_symbol || 'Rp'} 5,000</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>1x Butter Croissant</span>
                                    <span>{storeForm.data.currency_symbol || 'Rp'} 25,000</span>
                                </div>
                            </div>

                            <div className="py-3 border-b border-dashed border-gray-300 space-y-1">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>{storeForm.data.currency_symbol || 'Rp'} 60,000</span>
                                </div>
                                {Number(storeForm.data.service_charge_percentage) > 0 && (
                                    <div className="flex justify-between text-gray-600">
                                        <span>Service ({storeForm.data.service_charge_percentage}%)</span>
                                        <span>{storeForm.data.currency_symbol || 'Rp'} 3,000</span>
                                    </div>
                                )}
                                {Number(storeForm.data.tax_percentage) > 0 && (
                                    <div className="flex justify-between text-gray-600">
                                        <span>Tax ({storeForm.data.tax_percentage}%)</span>
                                        <span>{storeForm.data.currency_symbol || 'Rp'} 6,930</span>
                                    </div>
                                )}
                                <div className="flex justify-between font-bold text-gray-900 pt-1 text-sm">
                                    <span>TOTAL</span>
                                    <span>{storeForm.data.currency_symbol || 'Rp'} 69,930</span>
                                </div>
                            </div>

                            {storeForm.data.receipt_footer && (
                                <div className="pt-3 text-center text-[10px] text-gray-600 italic">
                                    {storeForm.data.receipt_footer}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
