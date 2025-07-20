'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthModal from '@/components/AuthModal';
import { useAuth } from '@/components/AuthProvider';
import { formatPrice } from '@/utils/format';

export default function CheckoutPage() {
    const searchParams = useSearchParams();
    const slotId = searchParams.get('slotId');
    const [isLoading, setIsLoading] = useState(false);
    const [slot, setSlot] = useState<any>(null);
    const [turf, setTurf] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const { user, isLoading: authLoading } = useAuth();

    // Fetch slot and turf data
    useEffect(() => {
        if (!slotId) return;

        const fetchSlotData = async () => {
            try {
                // In a real implementation, we would fetch this from the API
                // For now, using mock data
                setSlot({
                    id: slotId,
                    turf_id: 'turf-1',
                    start_time: '2025-07-18T18:00:00Z',
                    end_time: '2025-07-18T19:00:00Z',
                    price: 150000, // 1500 rupees in paise
                    status: 'available',
                });

                setTurf({
                    id: 'turf-1',
                    slug: 'xyz-turf',
                    name: 'XYZ Turf',
                    photos: ['https://xsgames.co/randomusers/assets/avatars/pixel/1.jpg'],
                });
            } catch (err) {
                console.error('Error fetching slot data:', err);
                setError('Failed to load booking details. Please try again.');
            }
        };

        fetchSlotData();
    }, [slotId]);

    const handleCheckout = async () => {
        if (!slotId || !user) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ slotId }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create checkout session');
            }

            // Redirect to Stripe Checkout
            window.location.href = data.checkoutUrl;
        } catch (err) {
            console.error('Error creating checkout session:', err);
            setError('Failed to process payment. Please try again.');
            setIsLoading(false);
        }
    };

    // If we don't have a slotId, show an error
    if (!slotId) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-slate-900">Invalid Checkout</h1>
                        <p className="mt-2 text-slate-500">No slot selected for checkout.</p>
                        <a
                            href="/"
                            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700"
                        >
                            Go Home
                        </a>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="max-w-3xl mx-auto">
                        <h1 className="text-3xl font-extrabold text-slate-900">Checkout</h1>

                        {error && (
                            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                {error}
                            </div>
                        )}

                        {!authLoading && !user ? (
                            <div className="mt-8">
                                <AuthModal onSuccess={() => { }} />
                            </div>
                        ) : (
                            <div className="mt-8">
                                {slot && turf ? (
                                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                                        <div className="px-4 py-5 sm:px-6">
                                            <h2 className="text-lg leading-6 font-medium text-slate-900">Booking Summary</h2>
                                            <p className="mt-1 max-w-2xl text-sm text-slate-500">
                                                Review your booking details before proceeding to payment.
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
                                                    <dd className="mt-1 text-sm text-slate-900">
                                                        {new Date(slot.start_time).toLocaleDateString()}
                                                    </dd>
                                                </div>
                                                <div className="sm:col-span-1">
                                                    <dt className="text-sm font-medium text-slate-500">Time</dt>
                                                    <dd className="mt-1 text-sm text-slate-900">
                                                        {new Date(slot.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                                                        {new Date(slot.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </dd>
                                                </div>
                                                <div className="sm:col-span-1">
                                                    <dt className="text-sm font-medium text-slate-500">Price</dt>
                                                    <dd className="mt-1 text-sm text-emerald-600 font-bold">{formatPrice(slot.price)}</dd>
                                                </div>
                                            </dl>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
                                        <div className="animate-pulse flex space-x-4">
                                            <div className="flex-1 space-y-4 py-1">
                                                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                                                <div className="space-y-2">
                                                    <div className="h-4 bg-slate-200 rounded"></div>
                                                    <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-8">
                                    <button
                                        type="button"
                                        className="w-full bg-emerald-600 border border-transparent rounded-md py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                                        onClick={handleCheckout}
                                        disabled={isLoading || !user || !slot}
                                    >
                                        {isLoading ? 'Processing...' : 'Proceed to Payment'}
                                    </button>
                                    <p className="mt-2 text-center text-sm text-slate-500">
                                        You'll be redirected to Stripe to complete your payment.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}