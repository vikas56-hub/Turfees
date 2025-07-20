'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/components/AuthProvider';
import AuthModal from '@/components/AuthModal';
import { formatDate, formatTime } from '@/utils/format';

export default function ReviewPage({ params }: { params: Promise<{ bookingId: string }> }) {
    const { bookingId } = use(params);
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();
    const [booking, setBooking] = useState<any>(null);
    const [slot, setSlot] = useState<any>(null);
    const [turf, setTurf] = useState<any>(null);
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    // Fetch booking data
    useEffect(() => {
        const fetchBookingData = async () => {
            if (!bookingId || !user) return;

            try {
                setLoading(true);

                const response = await fetch(`/api/booking/${bookingId}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch booking data');
                }

                const data = await response.json();
                setBooking(data.booking);
                setSlot(data.slot);
                setTurf(data.turf);

                // Check if a review already exists
                const reviewResponse = await fetch(`/api/review/${bookingId}`);
                if (reviewResponse.ok) {
                    const reviewData = await reviewResponse.json();
                    if (reviewData.review) {
                        setRating(reviewData.review.rating);
                        setComment(reviewData.review.comment || '');
                    }
                }
            } catch (err) {
                console.error('Error fetching booking data:', err);
                setError('Failed to load booking details. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchBookingData();
    }, [bookingId, user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!rating) {
            setError('Please select a rating');
            return;
        }

        try {
            setSubmitting(true);
            setError(null);

            const response = await fetch('/api/review', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bookingId,
                    rating,
                    comment,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to submit review');
            }

            setSuccess(true);
            setTimeout(() => {
                router.push('/');
            }, 3000);
        } catch (err: any) {
            console.error('Error submitting review:', err);
            setError(err.message || 'Failed to submit review. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (!authLoading && !user) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <div className="max-w-3xl mx-auto">
                            <div className="text-center">
                                <h1 className="text-3xl font-extrabold text-slate-900">Submit a Review</h1>
                                <p className="mt-4 text-lg text-slate-500">
                                    Please sign in to submit a review.
                                </p>
                            </div>
                            <div className="mt-8">
                                <AuthModal onSuccess={() => { }} />
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

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

    if (error && !booking) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-slate-900">Error</h1>
                        <p className="mt-2 text-slate-500">{error}</p>
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

    if (success) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <div className="rounded-full h-12 w-12 bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="mt-4 text-2xl font-bold text-slate-900">Thank You!</h1>
                        <p className="mt-2 text-slate-500">Your review has been submitted successfully.</p>
                        <p className="mt-1 text-slate-500">Redirecting to home page...</p>
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
                        <div className="text-center">
                            <h1 className="text-3xl font-extrabold text-slate-900">Rate Your Experience</h1>
                            <p className="mt-4 text-lg text-slate-500">
                                How was your experience at {turf?.name}?
                            </p>
                        </div>

                        {error && (
                            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                {error}
                            </div>
                        )}

                        <div className="mt-8">
                            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                                <div className="px-4 py-5 sm:px-6">
                                    <h2 className="text-lg leading-6 font-medium text-slate-900">Booking Details</h2>
                                </div>
                                <div className="border-t border-slate-200 px-4 py-5 sm:px-6">
                                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-slate-500">Turf</dt>
                                            <dd className="mt-1 text-sm text-slate-900">{turf?.name}</dd>
                                        </div>
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-slate-500">Date</dt>
                                            <dd className="mt-1 text-sm text-slate-900">
                                                {slot && formatDate(new Date(slot.start_time))}
                                            </dd>
                                        </div>
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-slate-500">Time</dt>
                                            <dd className="mt-1 text-sm text-slate-900">
                                                {slot && `${formatTime(new Date(slot.start_time))} - ${formatTime(new Date(slot.end_time))}`}
                                            </dd>
                                        </div>
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-slate-500">Status</dt>
                                            <dd className="mt-1 text-sm text-emerald-600 font-bold capitalize">
                                                {booking?.status}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>

                            <form className="mt-8" onSubmit={handleSubmit}>
                                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                                    <div className="px-4 py-5 sm:px-6">
                                        <h2 className="text-lg leading-6 font-medium text-slate-900">Your Review</h2>
                                    </div>
                                    <div className="border-t border-slate-200 px-4 py-5 sm:px-6">
                                        <div className="mb-6">
                                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                                Rating
                                            </label>
                                            <div className="flex space-x-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setRating(star)}
                                                        className="text-3xl focus:outline-none"
                                                    >
                                                        <span className={star <= rating ? 'text-yellow-400' : 'text-slate-300'}>
                                                            ★
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <label htmlFor="comment" className="block text-sm font-medium text-slate-700 mb-2">
                                                Comment (Optional)
                                            </label>
                                            <textarea
                                                id="comment"
                                                name="comment"
                                                rows={4}
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                className="shadow-sm focus:ring-emerald-500 focus:border-emerald-500 block w-full sm:text-sm border-slate-300 rounded-md"
                                                placeholder="Share your experience..."
                                            />
                                        </div>

                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                disabled={submitting || !rating}
                                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-emerald-300 disabled:cursor-not-allowed"
                                            >
                                                {submitting ? 'Submitting...' : 'Submit Review'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}