import { Head, Link, useForm } from '@inertiajs/react';
import {
    authenticate,
    signup,
} from '@/actions/App/Http/Controllers/AuthController';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(authenticate.url());
    };

    return (
        <>
            <Head title="Login" />
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="w-full max-w-md rounded bg-white p-8 shadow">
                    <div className="mb-6 text-center">
                        <h1 className="text-3xl font-semibold">
                            Welcome Back!
                        </h1>
                    </div>
                    <form className="w-full" onSubmit={submit}>
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
                        <div className="flex items-center justify-between">
                            <button
                                className={`rounded px-4 py-2 font-bold text-white ${processing ? 'cursor-not-allowed bg-blue-400 opacity-70' : 'bg-blue-600 hover:bg-blue-700'}`}
                                type="submit"
                                disabled={processing}
                            >
                                {processing ? 'Signing in...' : 'Sign In'}
                            </button>
                            <Link
                                className="text-sm text-blue-600 hover:text-blue-800"
                                href={signup.url()}
                            >
                                Don't have an account? Sign up
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
