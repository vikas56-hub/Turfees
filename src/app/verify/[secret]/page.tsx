'use client';

import { useState, useEffect, use } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { formatDate, formatTime } from '@/utils/format';

export default function VerifyPage({ params }: { params: Promise<{ secret: string }> }) {
    const { secret } = use(params);
    const [verification, setVerification] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const verifyQRCode = async () => {
            try {
                setLoading(true);

                const response = await fetch(`/api/verify/${secret}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to verify QR code');
                }

                setVerification(data);
            } catch (err) {
                console.error('Error verifying QR code:', err);
                setError('Failed to verify QR code. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        verifyQRCode();
    }, [secret]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto"></div>
                        <p className="mt-4 text-slate-500">Verifying QR code...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (error || !verification) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <div className="rounded-full h-12 w-12 bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h1 className="mt-4 text-2xl font-bold text-slate-900">Invalid QR Code</h1>
                        <p className="mt-2 text-slate-500">{error || 'The QR code could not be verified.'}</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const { valid, message, booking, slot, turf } = verification;
    const startDate = new Date(slot.start_time);
    const endDate = new Date(slot.end_time);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center">
                            {valid ? (
                                <>
                                    <div className="rounded-full h-12 w-12 bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h1 className="mt-4 text-2xl font-bold text-slate-900">Valid Booking</h1>
                                </>
                            ) : (
                                <>
                                    <div className="rounded-full h-12 w-12 bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </div>
                                    <h1 className="mt-4 text-2xl font-bold text-slate-900">Invalid Booking</h1>
                                </>
                            )}
                            <p className="mt-2 text-lg text-slate-500">{message}</p>
                        </div>

                        <div className="mt-8">
                            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                                <div className="px-4 py-5 sm:px-6">
                                    <h2 className="text-lg leading-6 font-medium text-slate-900">Booking Details</h2>
                                    <p className="mt-1 max-w-2xl text-sm text-slate-500">
                                        Reference ID: {booking.id}
                                    </p>
                                </div>
                                <div className="border-t border-slate-200 px-4 py-5 sm:px-6">
                                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-slate-500">Turf</dt>
                                            <dd className="mt-1 text-sm text-slate-900">{turf.name}</dd>
                                        </div>
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-slate-500">Date</dt>
                                            <dd className="mt-1 text-sm text-slate-900">{formatDate(startDate)}</dd>
                                        </div>
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-slate-500">Time</dt>
                                            <dd className="mt-1 text-sm text-slate-900">
                                                {formatTime(startDate)} - {formatTime(endDate)}
                                            </dd>
                                        </div>
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-slate-500">Status</dt>
                                            <dd className={`mt-1 text-sm font-bold capitalize ${booking.status === 'confirmed' ? 'text-emerald-600' : 'text-red-600'
                                                }`}>
                                                {booking.status}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}