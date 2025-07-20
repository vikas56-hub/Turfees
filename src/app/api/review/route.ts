import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
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

        const body = await request.json();
        const { bookingId, rating, comment } = body;

        if (!bookingId || !rating) {
            return NextResponse.json({ error: 'Booking ID and rating are required' }, { status: 400 });
        }

        // Validate rating
        if (rating < 1 || rating > 5) {
            return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
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

        // Check if a review already exists for this booking
        const { data: existingReview, error: existingReviewError } = await supabase
            .from('reviews')
            .select('id')
            .eq('booking_id', bookingId)
            .single();

        if (existingReview) {
            // Update existing review
            const { error: updateError } = await supabase
                .from('reviews')
                .update({
                    rating,
                    comment: comment || null,
                })
                .eq('id', existingReview.id);

            if (updateError) {
                return NextResponse.json({ error: updateError.message }, { status: 500 });
            }

            return NextResponse.json({ message: 'Review updated successfully' });
        } else {
            // Create new review
            const { error: insertError } = await supabase
                .from('reviews')
                .insert({
                    booking_id: bookingId,
                    rating,
                    comment: comment || null,
                });

            if (insertError) {
                return NextResponse.json({ error: insertError.message }, { status: 500 });
            }

            return NextResponse.json({ message: 'Review submitted successfully' });
        }
    } catch (error) {
        console.error('Error submitting review:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}