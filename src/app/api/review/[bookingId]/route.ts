import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(
    request: NextRequest,
    { params }: { params: { bookingId: string } }
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

        const bookingId = params.bookingId;

        if (!bookingId) {
            return NextResponse.json({ error: 'Booking ID is required' }, { status: 400 });
        }

        // Check if the booking exists and belongs to the user
        const { data: booking, error: bookingError } = await supabase
            .from('bookings')
            .select('*')
            .eq('id', bookingId)
            .single();

        if (bookingError || !booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        if (booking.user_id !== session.user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        // Get the review for this booking
        const { data: review, error: reviewError } = await supabase
            .from('reviews')
            .select('*')
            .eq('booking_id', bookingId)
            .single();

        if (reviewError && reviewError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
            return NextResponse.json({ error: reviewError.message }, { status: 500 });
        }

        return NextResponse.json({ review: review || null });
    } catch (error) {
        console.error('Error fetching review:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}