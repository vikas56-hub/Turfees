import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Create a Supabase client with the cookies
        const cookieStore = cookies();
        const supabaseServer = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value;
                    },
                    set(name: string, value: string, options: any) {
                        cookieStore.set({ name, value, ...options });
                    },
                    remove(name: string, options: any) {
                        cookieStore.set({ name, value: '', ...options });
                    },
                },
            }
        );

        // Get the user from the session
        const { data: { session } } = await supabaseServer.auth.getSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const id = params.id;

        if (!id) {
            return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
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
            .eq('id', id)
            .single();

        if (bookingError) {
            return NextResponse.json({ error: bookingError.message }, { status: 500 });
        }

        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        // Check if the booking belongs to the authenticated user
        if (booking.user_id !== session.user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        // Extract slot and turf data from the joined query
        const slot = booking.slots;
        const turf = slot.turfs;
        delete booking.slots;

        return NextResponse.json({ booking, slot, turf });
    } catch (error) {
        console.error('Error fetching booking data:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}