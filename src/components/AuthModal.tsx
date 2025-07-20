'use client';

import { useState } from 'react';
import { useAuth } from './AuthProvider';

interface AuthModalProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

export default function AuthModal({ onSuccess, onCancel }: AuthModalProps) {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const { signIn, signInWithGoogle } = useAuth();

    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            await signIn(email);
            setMessage('Check your email for the login link!');
            if (onSuccess) onSuccess();
        } catch (error: any) {
            setMessage(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setMessage('');

        try {
            await signInWithGoogle();
            if (onSuccess) onSuccess();
        } catch (error: any) {
            setMessage(`Error: ${error.message}`);
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-medium text-slate-900">Sign in to continue</h2>
            <p className="mt-1 text-sm text-slate-500">
                You need to sign in or create an account to complete your booking.
            </p>

            {message && (
                <div className="mt-4 p-3 bg-emerald-50 text-emerald-700 rounded-md">
                    {message}
                </div>
            )}

            <form className="mt-6 space-y-6" onSubmit={handleEmailSignIn}>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                        Email address
                    </label>
                    <div className="mt-1">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                            disabled={isLoading}
                        />
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Signing in...' : 'Continue with Email'}
                    </button>
                </div>

                <div className="flex items-center justify-center">
                    <div className="text-sm">
                        <p className="text-slate-500">
                            We'll send you a magic link to sign in.
                        </p>
                    </div>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-slate-500">Or continue with</span>
                    </div>
                </div>

                <div>
                    <button
                        type="button"
                        className="w-full flex justify-center py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                    >
                        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                            <path
                                d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0012.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z"
                                fill="#4285F4"
                            />
                        </svg>
                        Google
                    </button>
                </div>

                {onCancel && (
                    <div className="mt-4 text-center">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="text-sm text-slate-500 hover:text-slate-700"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
}