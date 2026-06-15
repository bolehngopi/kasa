import { Head, Link, useForm } from '@inertiajs/react';
import { login, register } from '@/routes';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(register.url());
    };

    return (
        <>
            <Head title="Register" />
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="w-full max-w-md rounded bg-white p-8 shadow">
                    <div className="mb-6 text-center">
                        <h1 className="text-3xl font-semibold">
                            Create an Account
                        </h1>
                    </div>
                    <form className="w-full" onSubmit={submit}>
                        <div className="mb-4">
                            <label
                                className="mb-2 block text-sm font-medium text-gray-700"
                                htmlFor="name"
                            >
                                Name
                            </label>
                            <input
                                className={`w-full rounded border px-3 py-2 leading-tight text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none ${errors.name ? 'border-red-300' : 'border-gray-200'}`}
                                id="name"
                                name="name"
                                type="name"
                                autoComplete="name"
                                placeholder="Enter your name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                required
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.name}
                                </p>
                            )}
                        </div>
                        <div className="mb-4">
                            <label
                                className="mb-2 block text-sm font-medium text-gray-700"
                                htmlFor="email"
                            >
                                Email
                            </label>
                            <input
                                className={`w-full rounded border px-3 py-2 leading-tight text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none ${errors.email ? 'border-red-300' : 'border-gray-200'}`}
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                placeholder="you@example.com"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                required
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.email}
                                </p>
                            )}
                        </div>
                        <div className="mb-6">
                            <label
                                className="mb-2 block text-sm font-medium text-gray-700"
                                htmlFor="password"
                            >
                                Password
                            </label>
                            <input
                                className={`w-full rounded border px-3 py-2 leading-tight text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none ${errors.password ? 'border-red-300' : 'border-gray-200'}`}
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                placeholder="Enter your password"
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                required
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.password}
                                </p>
                            )}
                        </div>
                        <div className="mb-6">
                            <label
                                className="mb-2 block text-sm font-medium text-gray-700"
                                htmlFor="password-confirmation"
                            >
                                Confirm Password
                            </label>
                            <input
                                className={`w-full rounded border px-3 py-2 leading-tight text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none ${errors.password_confirmation ? 'border-red-300' : 'border-gray-200'}`}
                                id="password-confirmation"
                                name="password_confirmation"
                                type="password"
                                autoComplete="current-password"
                                placeholder="Confirm your password"
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData(
                                        'password_confirmation',
                                        e.target.value,
                                    )
                                }
                                required
                            />
                            {errors.password_confirmation && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.password_confirmation}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center justify-between">
                            <button
                                className={`rounded px-4 py-2 font-bold text-white ${processing ? 'cursor-not-allowed bg-blue-400 opacity-70' : 'bg-blue-600 hover:bg-blue-700'}`}
                                type="submit"
                                disabled={processing}
                            >
                                {processing ? 'Registering...' : 'Register'}
                            </button>
                            <Link
                                className="text-sm text-blue-600 hover:text-blue-800"
                                href={login.url()}
                            >
                                Already have an account? Sign in
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
