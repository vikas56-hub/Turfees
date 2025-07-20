'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { formatPrice, formatDate, formatTime } from '@/utils/format';
import { useAuth } from '@/components/AuthProvider';
import AuthModal from '@/components/AuthModal';
import AdminCalendar from '@/components/AdminCalendar';

export default function AdminDashboardPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();
    const [activeTab, setActiveTab] = useState('bookings');
    const [turf, setTurf] = useState<any>(null);
    const [slots, setSlots] = useState<any[]>([]);
    const [bookings, setBookings] = useState<any[]>([]);
    const [totalEarnings, setTotalEarnings] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    // Fetch turf data
    useEffect(() => {
        const fetchTurfData = async () => {
            if (!user) return;

            try {
                setLoading(true);

                const response = await fetch(`/api/admin/turf/${slug}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch turf data');
                }

                const data = await response.json();
                setTurf(data.turf);
                setSlots(data.slots);
                setTotalEarnings(data.totalEarnings);

                // Extract bookings from slots
                const extractedBookings = data.slots
                    .flatMap((slot: any) => slot.bookings || [])
                    .filter((booking: any) => booking);

                setBookings(extractedBookings);
            } catch (err) {
                console.error('Error fetching turf data:', err);
                setError('Failed to load turf data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchTurfData();
    }, [slug, user]);

    // Handle slot status update
    const handleSlotStatusUpdate = async (slotId: string, status: 'available' | 'blocked') => {
        try {
            setIsUpdating(true);

            const response = await fetch('/api/admin/slot', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ slotId, status }),
            });

            if (!response.ok) {
                throw new Error('Failed to update slot status');
            }

            // Update the slot in the local state
            setSlots((currentSlots) =>
                currentSlots.map((slot) =>
                    slot.id === slotId ? { ...slot, status } : slot
                )
            );
        } catch (err) {
            console.error('Error updating slot status:', err);
            alert('Failed to update slot status. Please try again.');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="md:flex md:items-center md:justify-between">
                        <div className="flex-1 min-w-0">
                            <h1 className="text-3xl font-extrabold text-slate-900">{turf.name} Dashboard</h1>
                        </div>
                        <div className="mt-4 flex md:mt-0 md:ml-4">
                            <a
                                href={`/t/${slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                            >
                                View Public Page
                            </a>
                        </div>
                    </div>

                    <div className="mt-8">
                        <div className="sm:hidden">
                            <label htmlFor="tabs" className="sr-only">
                                Select a tab
                            </label>
                            <select
                                id="tabs"
                                name="tabs"
                                className="block w-full focus:ring-emerald-500 focus:border-emerald-500 border-slate-300 rounded-md"
                                value={activeTab}
                                onChange={(e) => setActiveTab(e.target.value)}
                            >
                                <option value="bookings">Today's Bookings</option>
                                <option value="calendar">Calendar</option>
                                <option value="earnings">Earnings</option>
                                <option value="settings">Settings</option>
                            </select>
                        </div>
                        <div className="hidden sm:block">
                            <div className="border-b border-slate-200">
                                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                    {['bookings', 'calendar', 'earnings', 'settings'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`${activeTab === tab
                                                ? 'border-emerald-500 text-emerald-600'
                                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
                                        >
                                            {tab === 'bookings' ? "Today's Bookings" : tab}
                                        </button>
                                    ))}
                                </nav>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8">
                        {activeTab === 'bookings' && (
                            <div>
                                <h2 className="text-lg font-medium text-slate-900">Today's Bookings</h2>
                                <div className="mt-4 flex flex-col">
                                    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                                            <div className="shadow overflow-hidden border-b border-slate-200 sm:rounded-lg">
                                                <table className="min-w-full divide-y divide-slate-200">
                                                    <thead className="bg-slate-50">
                                                        <tr>
                                                            <th
                                                                scope="col"
                                                                className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                                                            >
                                                                Customer
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                                                            >
                                                                Time
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                                                            >
                                                                Amount
                                                            </th>
                                                            <th
                                                                scope="col"
                                                                className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                                                            >
                                                                Status
                                                            </th>
                                                            <th scope="col" className="relative px-6 py-3">
                                                                <span className="sr-only">Actions</span>
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-slate-200">
                                                        {bookings.map((booking) => (
                                                            <tr key={booking.id}>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="flex items-center">
                                                                        <div>
                                                                            <div className="text-sm font-medium text-slate-900">{booking.user_name}</div>
                                                                            <div className="text-sm text-slate-500">{booking.user_email}</div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="text-sm text-slate-900">
                                                                        {formatTime(booking.slot.start_time)} - {formatTime(booking.slot.end_time)}
                                                                    </div>
                                                                    <div className="text-sm text-slate-500">
                                                                        {formatDate(booking.slot.start_time)}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="text-sm text-emerald-600 font-bold">{formatPrice(booking.amount)}</div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800 capitalize">
                                                                        {booking.status}
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                    <button
                                                                        type="button"
                                                                        className="text-emerald-600 hover:text-emerald-900"
                                                                    >
                                                                        View
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'calendar' && (
                            <div>
                                <h2 className="text-lg font-medium text-slate-900">Calendar</h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Manage your turf availability by blocking or unblocking slots.
                                </p>
                                <div className="mt-4">
                                    {loading ? (
                                        <div className="bg-white p-6 shadow rounded-lg flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto"></div>
                                            <p className="ml-4 text-slate-500">Loading calendar...</p>
                                        </div>
                                    ) : error ? (
                                        <div className="bg-white p-6 shadow rounded-lg">
                                            <p className="text-red-500">{error}</p>
                                        </div>
                                    ) : (
                                        <AdminCalendar
                                            slots={slots}
                                            onSlotStatusUpdate={handleSlotStatusUpdate}
                                            isUpdating={isUpdating}
                                        />
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'earnings' && (
                            <div>
                                <h2 className="text-lg font-medium text-slate-900">Earnings</h2>
                                <div className="mt-4 bg-white p-6 shadow rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm text-slate-500">Total Earnings</p>
                                            <p className="text-3xl font-bold text-emerald-600">{formatPrice(totalEarnings)}</p>
                                        </div>
                                        <button
                                            type="button"
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                                        >
                                            Request Payout
                                        </button>
                                    </div>
                                    <div className="mt-6">
                                        <h3 className="text-sm font-medium text-slate-700">Payout History</h3>
                                        <p className="mt-1 text-sm text-slate-500">
                                            No payouts yet. Request your first payout to see it here.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div>
                                <h2 className="text-lg font-medium text-slate-900">Settings</h2>
                                <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-lg">
                                    <div className="px-4 py-5 sm:px-6">
                                        <h3 className="text-lg leading-6 font-medium text-slate-900">Turf Information</h3>
                                        <p className="mt-1 max-w-2xl text-sm text-slate-500">
                                            Update your turf details and settings.
                                        </p>
                                    </div>
                                    <div className="border-t border-slate-200 px-4 py-5 sm:px-6">
                                        <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                                            <div className="sm:col-span-1">
                                                <dt className="text-sm font-medium text-slate-500">Turf Name</dt>
                                                <dd className="mt-1 text-sm text-slate-900">{turf.name}</dd>
                                            </div>
                                            <div className="sm:col-span-1">
                                                <dt className="text-sm font-medium text-slate-500">Base Price</dt>
                                                <dd className="mt-1 text-sm text-slate-900">{formatPrice(turf.base_price)}</dd>
                                            </div>
                                            <div className="sm:col-span-2">
                                                <dt className="text-sm font-medium text-slate-500">Description</dt>
                                                <dd className="mt-1 text-sm text-slate-900">{turf.description}</dd>
                                            </div>
                                            <div className="sm:col-span-2">
                                                <dt className="text-sm font-medium text-slate-500">Amenities</dt>
                                                <dd className="mt-1 text-sm text-slate-900">
                                                    <div className="flex flex-wrap gap-2">
                                                        {turf.amenities.map((amenity) => (
                                                            <span
                                                                key={amenity}
                                                                className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800"
                                                            >
                                                                {amenity}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </dd>
                                            </div>
                                            <div className="sm:col-span-2">
                                                <dt className="text-sm font-medium text-slate-500">Public URL</dt>
                                                <dd className="mt-1 text-sm text-slate-900">
                                                    <div className="flex items-center">
                                                        <span className="mr-2">https://turfees.app/t/{slug}</span>
                                                        <button
                                                            type="button"
                                                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-emerald-700 bg-emerald-100 hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(`https://turfees.app/t/${slug}`);
                                                                alert('URL copied to clipboard!');
                                                            }}
                                                        >
                                                            Copy
                                                        </button>
                                                    </div>
                                                </dd>
                                            </div>
                                        </dl>
                                    </div>
                                    <div className="border-t border-slate-200 px-4 py-5 sm:px-6">
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                                            >
                                                Edit Turf Details
                                            </button>
                                        </div>
                                    </div>
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