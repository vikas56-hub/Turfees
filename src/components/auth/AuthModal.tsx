"use client";

import { useState, useRef, useEffect } from 'react';
import { initializeDemoData, checkCredentials } from '@/lib/demoData';

type AuthModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [authMethod, setAuthMethod] = useState<'phone' | 'email' | 'google'>('phone');
    const [isLoading, setIsLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [error, setError] = useState('');

    const modalRef = useRef<HTMLDivElement>(null);

    // Close modal when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                onClose();
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Initialize demo data when component mounts
    useEffect(() => {
        initializeDemoData();
    }, []);

    // Handle phone OTP login
    const handleSendOTP = async () => {
        if (!phoneNumber || phoneNumber.length < 10) {
            setError('Please enter a valid phone number');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Check if phone number exists in demo data
            const demoUsers = JSON.parse(localStorage.getItem('demoUsers') || '[]');
            const userExists = demoUsers.some((user: any) => user.phone === phoneNumber);

            if (!userExists) {
                setError(`Demo credentials: Try 9876543210 (player) or 9876543211 (owner)`);
                setIsLoading(false);
                return;
            }

            // Simulate OTP being sent
            await new Promise(resolve => setTimeout(resolve, 1000));
            setOtpSent(true);
            setIsLoading(false);
        } catch (error) {
            setError('Failed to send OTP. Please try again.');
            setIsLoading(false);
        }
    };

    // Handle OTP verification
    const handleVerifyOTP = async () => {
        if (!otp || otp.length < 6) {
            setError('Please enter a valid OTP');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // In a real implementation, this would verify the OTP with an API
            // For demo, we'll use any 6 digits and check if the phone number exists
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Get user data from demo users
            const demoUsers = JSON.parse(localStorage.getItem('demoUsers') || '[]');
            const user = demoUsers.find((u: any) => u.phone === phoneNumber);

            if (user) {
                // Store user data in localStorage
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('currentUser', JSON.stringify({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role
                }));

                // Force page reload to update UI
                window.location.reload();
                onClose();
            } else {
                setError('User not found. Try with demo credentials.');
            }

            setIsLoading(false);
        } catch (error) {
            setError('Invalid OTP. Please try again.');
            setIsLoading(false);
        }
    };

    // Handle email login/signup
    const handleEmailAuth = async () => {
        if (!email || !email.includes('@')) {
            setError('Please enter a valid email address');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Check if email exists in demo data
            const demoUsers = JSON.parse(localStorage.getItem('demoUsers') || '[]');
            const user = demoUsers.find((u: any) => u.email === email);

            if (!user) {
                setError(`Demo credentials: Try player@example.com (player) or owner@example.com (owner)`);
                setIsLoading(false);
                return;
            }

            // Simulate sending magic link
            await new Promise(resolve => setTimeout(resolve, 1000));

            setIsLoading(false);
            // Show success message
            setError('Check your email for the login link! (Demo: Login successful)');

            // For demo purposes, we'll simulate a successful login after a delay
            setTimeout(() => {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('currentUser', JSON.stringify({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role
                }));

                // Force page reload to update UI
                window.location.reload();
                onClose();
            }, 2000);
        } catch (error) {
            setError('Failed to send login email. Please try again.');
            setIsLoading(false);
        }
    };

    // Handle Google OAuth
    const handleGoogleAuth = async () => {
        setIsLoading(true);
        setError('');

        try {
            // In a real implementation, this would redirect to Google OAuth
            // For now, we'll simulate successful authentication
            await new Promise(resolve => setTimeout(resolve, 1000));

            // For demo purposes, we'll log in as the player
            const demoUsers = JSON.parse(localStorage.getItem('demoUsers') || '[]');
            const user = demoUsers.find((u: any) => u.role === 'player');

            if (user) {
                // Store user data in localStorage
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('currentUser', JSON.stringify({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role
                }));

                // Force page reload to update UI
                window.location.reload();
            }

            onClose();
        } catch (error) {
            setError('Failed to sign in with Google. Please try again.');
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div
                ref={modalRef}
                className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden"
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {isLogin ? 'Login / Sign Up' : 'Create Account'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {authMethod === 'phone' && !otpSent && (
                        <>
                            <div className="mb-4">
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                    Enter Mobile No <span className="text-red-500">*</span>
                                </label>
                                <div className="flex">
                                    <div className="flex items-center justify-center px-3 border border-r-0 border-gray-300 bg-gray-50 rounded-l-md">
                                        <span className="text-gray-500">+91</span>
                                        <div className="ml-2 w-5 h-4 bg-gradient-to-b from-orange-500 via-white to-green-500 rounded-sm"></div>
                                    </div>
                                    <input
                                        type="tel"
                                        id="phone"
                                        className="flex-1 min-w-0 block w-full px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                        placeholder="10-digit mobile number"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleSendOTP}
                                disabled={isLoading}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md transition duration-200 flex items-center justify-center"
                            >
                                {isLoading ? (
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : null}
                                Send OTP
                            </button>
                        </>
                    )}

                    {authMethod === 'phone' && otpSent && (
                        <>
                            <div className="mb-4">
                                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                                    Enter OTP sent to +91 {phoneNumber}
                                </label>
                                <input
                                    type="text"
                                    id="otp"
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                    placeholder="6-digit OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                />
                                <div className="mt-2 text-sm text-gray-500 flex justify-between">
                                    <span>Didn't receive OTP?</span>
                                    <button
                                        onClick={() => {
                                            setOtpSent(false);
                                            setOtp('');
                                        }}
                                        className="text-emerald-600 hover:text-emerald-800"
                                    >
                                        Resend
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleVerifyOTP}
                                disabled={isLoading}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md transition duration-200 flex items-center justify-center"
                            >
                                {isLoading ? (
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : null}
                                Verify & Continue
                            </button>
                        </>
                    )}

                    {authMethod === 'email' && (
                        <>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Enter Email Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <button
                                onClick={handleEmailAuth}
                                disabled={isLoading}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md transition duration-200 flex items-center justify-center"
                            >
                                {isLoading ? (
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : null}
                                Continue with Email
                            </button>
                        </>
                    )}

                    {/* Error message */}
                    {error && (
                        <div className={`mt-4 text-sm ${error.includes('Demo') ? 'text-green-600' : 'text-red-600'}`}>
                            {error}
                        </div>
                    )}

                    {/* Divider */}
                    <div className="mt-6 mb-4 flex items-center">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink mx-4 text-gray-400">or</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    {/* Auth method options */}
                    <div className="grid grid-cols-2 gap-4">
                        {authMethod !== 'email' && (
                            <button
                                onClick={() => {
                                    setAuthMethod('email');
                                    setOtpSent(false);
                                    setError('');
                                }}
                                className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 transition duration-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Email Id
                            </button>
                        )}

                        {authMethod !== 'phone' && (
                            <button
                                onClick={() => {
                                    setAuthMethod('phone');
                                    setOtpSent(false);
                                    setError('');
                                }}
                                className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 transition duration-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                Phone
                            </button>
                        )}

                        <button
                            onClick={handleGoogleAuth}
                            className="col-span-2 flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 transition duration-200"
                        >
                            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                                <path fill="none" d="M1 1h22v22H1z" />
                            </svg>
                            Google
                        </button>
                    </div>

                    {/* Terms and conditions */}
                    <div className="mt-6 text-xs text-gray-500 text-center">
                        By continuing, you agree to Turfees&apos;s{' '}
                        <a href="/terms" className="text-emerald-600 hover:text-emerald-800">
                            Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="/privacy" className="text-emerald-600 hover:text-emerald-800">
                            Privacy Policy
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}