"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [bookings, setBookings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('bookings'); // 'bookings', 'profile', 'turfs'

    // Check if user is logged in
    useEffect(() => {
        const checkAuth = () => {
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            if (!isLoggedIn) {
                router.push('/');
                return;
            }

            // Get user data
            const userData = JSON.parse(localStorage.getItem('currentUser') || '{}');
            setUser(userData);

            // Get demo bookings
            const demoBookings = [
                {
                    id: 'booking-1',
                    turfName: 'Green Field Arena',
                    date: '2025-07-20',
                    startTime: '18:00',
                    endTime: '19:00',
                    price: 1200,
                    status: 'confirmed'
                },
                {
                    id: 'booking-2',
                    turfName: 'Sports Village',
                    date: '2025-07-25',
                    startTime: '17:00',
                    endTime: '18:00',
                    price: 1500,
                    status: 'pending'
                }
            ];
            setBookings(demoBookings);
            setIsLoading(false);
        };

        checkAuth();
    }, [router]);

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        router.push('/');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Header />
                <main className="flex-grow flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-grow py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Dashboard Header */}
                    <div className="bg-white shadow rounded-lg p-6 mb-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name || 'User'}</h1>
                                <p className="text-gray-600">{user?.role === 'owner' ? 'Turf Owner' : 'Player'}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="mt-4 sm:mt-0 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200"
                            >
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* Dashboard Tabs */}
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <div className="border-b border-gray-200">
                            <nav className="flex -mb-px">
                                <button
                                    onClick={() => setActiveTab('bookings')}
                                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'bookings'
                                            ? 'border-emerald-500 text-emerald-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    My Bookings
                                </button>
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'profile'
                                            ? 'border-emerald-500 text-emerald-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    Profile
                                </button>
                                {user?.role === 'owner' && (
                                    <button
                                        onClick={() => setActiveTab('turfs')}
                                        className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${activeTab === 'turfs'
                                                ? 'border-emerald-500 text-emerald-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                            }`}
                                    >
                                        My Turfs
                                    </button>
                                )}
                            </nav>
                        </div>

                        {/* Tab Content */}
                        <div className="p-6">
                            {/* Bookings Tab */}
                            {activeTab === 'bookings' && (
                                <div>
                                    <h2 className="text-lg font-medium text-gray-900 mb-4">Your Bookings</h2>
                                    {bookings.length === 0 ? (
                                        <p className="text-gray-500">You don't have any bookings yet.</p>
                                    ) : (
                                        <div className="space-y-4">
                                            {bookings.map((booking) => (
                                                <div key={booking.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                    <div className="flex flex-col sm:flex-row justify-between">
                                                        <div>
                                                            <h3 className="font-medium text-gray-900">{booking.turfName}</h3>
                                                            <p className="text-sm text-gray-600">
                                                                {booking.date} • {booking.startTime} - {booking.endTime}
                                                            </p>
                                                        </div>
                                                        <div className="mt-2 sm:mt-0">
                                                            <span className="text-sm font-medium">₹{booking.price}</span>
                                                            <span
                                                                className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${booking.status === 'confirmed'
                                                                        ? 'bg-green-100 text-green-800'
                                                                        : 'bg-yellow-100 text-yellow-800'
                                                                    }`}
                                                            >
                                                                {booking.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="mt-4 flex justify-end">
                                                        <button className="text-sm text-emerald-600 hover:text-emerald-800">
                                                            View Details
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Profile Tab */}
                            {activeTab === 'profile' && (
                                <div>
                                    <h2 className="text-lg font-medium text-gray-900 mb-4">Your Profile</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Name</label>
                                            <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded-md">
                                                {user?.name || 'Not provided'}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Email</label>
                                            <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded-md">
                                                {user?.email || 'Not provided'}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                                            <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded-md">
                                                {user?.phone || 'Not provided'}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Account Type</label>
                                            <div className="mt-1 p-2 bg-gray-50 border border-gray-300 rounded-md">
                                                {user?.role === 'owner' ? 'Turf Owner' : 'Player'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Turfs Tab (Owner only) */}
                            {activeTab === 'turfs' && (
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="text-lg font-medium text-gray-900">Your Turfs</h2>
                                        <button
                                            onClick={() => router.push('/onboard')}
                                            className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition duration-200"
                                        >
                                            Add New Turf
                                        </button>
                                    </div>

                                    {user?.role !== 'owner' ? (
                                        <p className="text-gray-500">You need to be a turf owner to manage turfs.</p>
                                    ) : (
                                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                            <div className="flex flex-col sm:flex-row justify-between">
                                                <div>
                                                    <h3 className="font-medium text-gray-900">Green Field Arena</h3>
                                                    <p className="text-sm text-gray-600">
                                                        Koramangala, Bangalore
                                                    </p>
                                                </div>
                                                <div className="mt-2 sm:mt-0">
                                                    <span className="text-sm font-medium">₹1200/hr</span>
                                                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        Active
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="mt-4 flex justify-end space-x-2">
                                                <button className="text-sm text-blue-600 hover:text-blue-800">
                                                    Edit
                                                </button>
                                                <button className="text-sm text-emerald-600 hover:text-emerald-800">
                                                    View Bookings
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}