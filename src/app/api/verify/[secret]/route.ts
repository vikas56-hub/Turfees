import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(
    request: NextRequest,
    { params }: { params: { secret: string } }
) {
    try {
        const secret = params.secret;

        if (!secret) {
            return NextResponse.json({ error: 'QR secret is required' }, { status: 400 });
        }

        // Get booking data with slot and turf information
        const { data: booking, error: bookingError } = await supabase
            .from('bookings')
            .select(`
        *,
        slots:slot_id (
          *,
          turfs:turf_id (*)
        )
      `)
            .eq('qr_secret', secret)
            .single();

        if (bookingError) {
            return NextResponse.json({ error: bookingError.message }, { status: 500 });
        }

        if (!booking) {
            return NextResponse.json({ error: 'Invalid QR code' }, { status: 404 });
        }

        // Extract slot and turf data from the joined query
        const slot = booking.slots;
        const turf = slot.turfs;
        delete booking.slots;

        // Check if the booking is valid (not cancelled)
        if (booking.status !== 'confirmed') {
            return NextResponse.json({
                valid: false,
                message: `Booking is ${booking.status}`,
                booking,
                slot,
                turf
            });
        }

        // Check if the booking is for a future slot
        const now = new Date();
        const slotStart = new Date(slot.start_time);
        const slotEnd = new Date(slot.end_time);

        if (now > slotEnd) {
            return NextResponse.json({
                valid: false,
                message: 'Booking has expired',
                booking,
                slot,
                turf
            });
        }

        // If all checks pass, the QR code is valid
        return NextResponse.json({
            valid: true,
            message: 'Valid booking',
            booking,
            slot,
            turf
        });
    } catch (error) {
        console.error('Error verifying QR code:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}