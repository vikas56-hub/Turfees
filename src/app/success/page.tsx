'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { formatDate, formatTime, formatPrice } from '@/utils/format';
import { generateAppleWalletUrl, generateGoogleWalletUrl } from '@/utils/wallet';
import { QRCodeSVG } from 'qrcode.react';

// Mock data - in a real app, this would be fetched from the API
const mockBooking = {
    id: 'booking-123',
    slot_id: 'slot-1',
    user_id: 'user-1',
    stripe_session_id: 'cs_test_123',
    amount: 150000, // 1500 rupees in paise
    status: 'confirmed',
    qr_secret: 'qr-secret-123',
    created_at: '2023-01-01T00:00:00Z',
};

const mockSlot = {
    id: 'slot-1',
    turf_id: 'turf-1',
    start_time: '2025-07-18T18:00:00Z',
    end_time: '2025-07-18T19:00:00Z',
    price: 150000, // 1500 rupees in paise
    status: 'booked',
    created_at: '2023-01-01T00:00:00Z',
};

const mockTurf = {
    id: 'turf-1',
    slug: 'xyz-turf',
    name: 'XYZ Turf',
    description: 'A premium turf for football and cricket enthusiasts.',
    photos: ['https://xsgames.co/randomusers/assets/avatars/pixel/1.jpg'],
    location: { x: 12.9716, y: 77.5946 },
    address: '123 Main St, Bangalore, Karnataka 560001',
    phone: '+91 9876543210',
};

export default function SuccessPage() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const [booking, setBooking] = useState<any>(null);
    const [slot, setSlot] = useState<any>(null);
    const [turf, setTurf] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch booking data
    useEffect(() => {
        const fetchBookingData = async () => {
            if (!sessionId) return;

            try {
                setLoading(true);

                const response = await fetch(`/api/booking/session/${sessionId}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch booking data');
                }

                const data = await response.json();
                setBooking(data.booking);
                setSlot(data.slot);
                setTurf(data.turf);
            } catch (err) {
                console.error('Error fetching booking data:', err);
                setError('Failed to load booking details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchBookingData();
    }, [sessionId]);

    // If we don't have a sessionId, show an error
    if (!sessionId) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-slate-900">Invalid Booking</h1>
                        <p className="mt-2 text-slate-500">No booking information found.</p>
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

    // Show loading state
    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto"></div>
                        <p className="mt-4 text-slate-500">Loading booking details...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Show error state
    if (error || !booking || !slot || !turf) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-slate-900">Booking Error</h1>
                        <p className="mt-2 text-slate-500">{error || 'Failed to load booking details.'}</p>
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

    const startDate = new Date(slot.start_time);
    const endDate = new Date(slot.end_time);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center">
                            <svg
                                className="mx-auto h-12 w-12 text-emerald-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                            <h1 className="mt-3 text-3xl font-extrabold text-slate-900">Booking Confirmed!</h1>
                            <p className="mt-2 text-lg text-slate-500">
                                Your booking has been confirmed and your QR ticket is ready.
                            </p>
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
                                            <dd className="mt-1 text-sm text-emerald-600 font-bold capitalize">{booking.status}</dd>
                                        </div>
                                        <div className="sm:col-span-2">
                                            <dt className="text-sm font-medium text-slate-500">Location</dt>
                                            <dd className="mt-1 text-sm text-slate-900">{turf.address}</dd>
                                        </div>
                                        <div className="sm:col-span-2">
                                            <dt className="text-sm font-medium text-slate-500">Contact</dt>
                                            <dd className="mt-1 text-sm text-slate-900">{turf.phone}</dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>

                            <div className="mt-8">
                                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                                    <div className="px-4 py-5 sm:px-6">
                                        <h2 className="text-lg leading-6 font-medium text-slate-900">QR Ticket</h2>
                                        <p className="mt-1 max-w-2xl text-sm text-slate-500">
                                            Show this QR code at the turf entrance.
                                        </p>
                                    </div>
                                    <div className="border-t border-slate-200 px-4 py-5 sm:px-6">
                                        <div className="flex justify-center">
                                            <div className="p-4 bg-white rounded-lg shadow-sm">
                                                <QRCodeSVG
                                                    value={`https://turfees.app/verify/${booking.qr_secret}`}
                                                    size={256}
                                                    bgColor={"#ffffff"}
                                                    fgColor={"#059669"}
                                                    level={"H"}
                                                    includeMargin={true}
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-6 flex justify-center space-x-4">
                                            <a
                                                href={generateAppleWalletUrl(booking, slot, turf)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                                            >
                                                Add to Apple Wallet
                                            </a>
                                            <a
                                                href={generateGoogleWalletUrl(booking, slot, turf)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                                            >
                                                Add to Google Wallet
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-center">
                                <a
                                    href="/"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                                >
                                    Book Another Turf
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}