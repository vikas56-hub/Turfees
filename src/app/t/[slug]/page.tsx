'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { formatPrice, formatDate, formatTime } from '@/utils/format';
import { Turf, Slot } from '@/types';

export default function TurfPage({ params }: { params: { slug: string } }) {
    const { slug } = params;
    const router = useRouter();
    const [turf, setTurf] = useState<Turf | null>(null);
    const [slots, setSlots] = useState<Slot[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

    // Fetch turf data
    useEffect(() => {
        const fetchTurfData = async () => {
            try {
                const response = await fetch(`/api/turf/${slug}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch turf data');
                }

                const data = await response.json();
                setTurf(data.turf);
                setSlots(data.slots);
            } catch (err) {
                console.error('Error fetching turf data:', err);
                setError('Failed to load turf data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchTurfData();
    }, [slug]);

    // Filter slots by selected date
    const filteredSlots = slots.filter(slot => {
        const slotDate = new Date(slot.start_time);
        return (
            slotDate.getDate() === selectedDate.getDate() &&
            slotDate.getMonth() === selectedDate.getMonth() &&
            slotDate.getFullYear() === selectedDate.getFullYear()
        );
    });

    // Group slots by date for date selection
    const dateOptions = slots.reduce((dates: Date[], slot) => {
        const slotDate = new Date(slot.start_time);
        slotDate.setHours(0, 0, 0, 0);

        // Check if date already exists in array
        if (!dates.some(date =>
            date.getDate() === slotDate.getDate() &&
            date.getMonth() === slotDate.getMonth() &&
            date.getFullYear() === slotDate.getFullYear()
        )) {
            dates.push(slotDate);
        }

        return dates;
    }, []);

    // Handle booking
    const handleBookSlot = () => {
        if (selectedSlot) {
            router.push(`/checkout?slotId=${selectedSlot.id}`);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto"></div>
                        <p className="mt-4 text-slate-500">Loading turf details...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (error || !turf) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-slate-900">Turf Not Found</h1>
                        <p className="mt-2 text-slate-500">{error || 'The requested turf could not be found.'}</p>
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
                {/* Hero Section */}
                <div className="relative">
                    <div className="h-64 sm:h-72 md:h-96 w-full bg-slate-200">
                        {turf.photos.length > 0 ? (
                            <img
                                src={turf.photos[0]}
                                alt={turf.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <span className="text-slate-400">No photos available</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Turf Details */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
                        <div>
                            <h1 className="text-3xl font-extrabold text-slate-900">{turf.name}</h1>
                            <p className="mt-2 text-slate-500">{turf.description}</p>

                            <div className="mt-6">
                                <h2 className="text-lg font-medium text-slate-900">Amenities</h2>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {turf.amenities.map((amenity) => (
                                        <span
                                            key={amenity}
                                            className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800"
                                        >
                                            {amenity}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-6">
                                <h2 className="text-lg font-medium text-slate-900">Opening Hours</h2>
                                <dl className="mt-2 text-sm text-slate-500">
                                    <div className="flex justify-between py-1">
                                        <dt className="font-medium">Monday - Friday</dt>
                                        <dd>
                                            {turf.open_hours.mon.start} - {turf.open_hours.mon.end}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between py-1">
                                        <dt className="font-medium">Saturday - Sunday</dt>
                                        <dd>
                                            {turf.open_hours.sat.start} - {turf.open_hours.sat.end}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>

                        <div className="mt-10 lg:mt-0">
                            <div className="bg-slate-50 p-6 rounded-lg shadow-sm">
                                <h2 className="text-lg font-medium text-slate-900">Book a Slot</h2>
                                <p className="mt-2 text-slate-500">
                                    Select a date and time to book this turf.
                                </p>

                                <div className="mt-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-900 font-medium">Base Price</span>
                                        <span className="text-emerald-600 font-bold">{formatPrice(turf.base_price)}</span>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <label htmlFor="date" className="block text-sm font-medium text-slate-700">
                                        Select Date
                                    </label>
                                    <select
                                        id="date"
                                        name="date"
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
                                        value={selectedDate.toISOString().split('T')[0]}
                                        onChange={(e) => {
                                            const newDate = new Date(e.target.value);
                                            setSelectedDate(newDate);
                                            setSelectedSlot(null);
                                        }}
                                    >
                                        {dateOptions.map((date) => (
                                            <option key={date.toISOString()} value={date.toISOString().split('T')[0]}>
                                                {formatDate(date)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mt-6">
                                    <label className="block text-sm font-medium text-slate-700">
                                        Available Slots
                                    </label>
                                    <div className="mt-2 grid grid-cols-2 gap-2">
                                        {filteredSlots.length > 0 ? (
                                            filteredSlots.map((slot) => (
                                                <button
                                                    key={slot.id}
                                                    type="button"
                                                    className={`px-4 py-2 text-sm font-medium rounded-md ${slot.status === 'available'
                                                            ? selectedSlot?.id === slot.id
                                                                ? 'bg-emerald-600 text-white'
                                                                : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                                        }`}
                                                    disabled={slot.status !== 'available'}
                                                    onClick={() => setSelectedSlot(slot)}
                                                >
                                                    {formatTime(new Date(slot.start_time))}
                                                </button>
                                            ))
                                        ) : (
                                            <p className="col-span-2 text-sm text-slate-500">
                                                No slots available for this date.
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <button
                                        type="button"
                                        className="w-full bg-emerald-600 border border-transparent rounded-md py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-slate-300 disabled:cursor-not-allowed"
                                        disabled={!selectedSlot}
                                        onClick={handleBookSlot}
                                    >
                                        Book & Pay
                                    </button>
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