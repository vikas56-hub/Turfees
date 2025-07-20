'use client';

import { useState } from 'react';
import { formatTime, formatDate } from '@/utils/format';

interface AdminCalendarProps {
    slots: any[];
    onSlotStatusUpdate: (slotId: string, status: 'available' | 'blocked') => void;
    isUpdating: boolean;
}

export default function AdminCalendar({ slots, onSlotStatusUpdate, isUpdating }: AdminCalendarProps) {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    // Group slots by date
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

    // Filter slots by selected date
    const filteredSlots = slots.filter(slot => {
        const slotDate = new Date(slot.start_time);
        return (
            slotDate.getDate() === selectedDate.getDate() &&
            slotDate.getMonth() === selectedDate.getMonth() &&
            slotDate.getFullYear() === selectedDate.getFullYear()
        );
    });

    // Sort slots by start time
    filteredSlots.sort((a, b) => {
        return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
    });

    const handleToggleSlotStatus = (slot: any) => {
        if (slot.status === 'booked') {
            return; // Cannot modify booked slots
        }

        const newStatus = slot.status === 'available' ? 'blocked' : 'available';
        onSlotStatusUpdate(slot.id, newStatus);
    };

    return (
        <div className="bg-white p-6 shadow rounded-lg">
            <div className="mb-6">
                <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-2">
                    Select Date
                </label>
                <select
                    id="date"
                    name="date"
                    className="block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
                    value={selectedDate.toISOString().split('T')[0]}
                    onChange={(e) => {
                        const newDate = new Date(e.target.value);
                        setSelectedDate(newDate);
                    }}
                >
                    {dateOptions.map((date) => (
                        <option key={date.toISOString()} value={date.toISOString().split('T')[0]}>
                            {formatDate(date)}
                        </option>
                    ))}
                </select>
            </div>

            <h3 className="text-lg font-medium text-slate-900 mb-4">Slot Management</h3>
            <p className="text-sm text-slate-500 mb-4">
                Click on a slot to toggle between available and blocked status. Booked slots cannot be modified.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSlots.length > 0 ? (
                    filteredSlots.map((slot) => (
                        <div
                            key={slot.id}
                            className={`p-4 rounded-lg border ${slot.status === 'available'
                                    ? 'bg-emerald-50 border-emerald-200'
                                    : slot.status === 'booked'
                                        ? 'bg-slate-50 border-slate-200'
                                        : 'bg-red-50 border-red-200'
                                } ${slot.status !== 'booked' ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                            onClick={() => slot.status !== 'booked' && handleToggleSlotStatus(slot)}
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium text-slate-900">
                                        {formatTime(new Date(slot.start_time))} - {formatTime(new Date(slot.end_time))}
                                    </p>
                                    <p className="text-sm text-slate-500">{formatDate(new Date(slot.start_time))}</p>
                                </div>
                                <span
                                    className={`px-2 py-1 text-xs font-semibold rounded-full ${slot.status === 'available'
                                            ? 'bg-emerald-100 text-emerald-800'
                                            : slot.status === 'booked'
                                                ? 'bg-slate-100 text-slate-800'
                                                : 'bg-red-100 text-red-800'
                                        } capitalize`}
                                >
                                    {slot.status}
                                </span>
                            </div>
                            {slot.bookings && slot.bookings.length > 0 && (
                                <div className="mt-2 pt-2 border-t border-slate-200">
                                    <p className="text-xs text-slate-500">Booked by: {slot.bookings[0].user?.email || 'Unknown'}</p>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-8 text-slate-500">
                        No slots available for this date.
                    </div>
                )}
            </div>

            {isUpdating && (
                <div className="fixed inset-0 bg-slate-900 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto"></div>
                        <p className="mt-4 text-slate-500">Updating slot status...</p>
                    </div>
                </div>
            )}
        </div>
    );
}