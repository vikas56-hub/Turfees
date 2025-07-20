import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { stripe } from '@/lib/stripe';
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

        const userId = session.user.id;
        const body = await request.json();
        const { slotId } = body;

        if (!slotId) {
            return NextResponse.json({ error: 'Slot ID is required' }, { status: 400 });
        }

        // Get slot data
        const { data: slot, error: slotError } = await supabase
            .from('slots')
            .select('*, turfs(*)')
            .eq('id', slotId)
            .single();

        if (slotError || !slot) {
            return NextResponse.json({ error: slotError?.message || 'Slot not found' }, { status: 404 });
        }

        if (slot.status !== 'available') {
            return NextResponse.json({ error: 'Slot is not available' }, { status: 400 });
        }

        // Create a Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: `${slot.turfs.name} - ${new Date(slot.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} to ${new Date(slot.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
                            description: `Booking for ${new Date(slot.start_time).toLocaleDateString()}`,
                        },
                        unit_amount: slot.price,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/t/${slot.turfs.slug}`,
            metadata: {
                slotId,
                userId,
            },
        });

        // Create a pending booking
        const { data: booking, error: bookingError } = await supabase
            .from('bookings')
            .insert({
                slot_id: slotId,
                user_id: userId,
                stripe_session_id: session.id,
                amount: slot.price,
                status: 'pending',
            })
            .select()
            .single();

        if (bookingError) {
            return NextResponse.json({ error: bookingError.message }, { status: 500 });
        }

        // Update slot status to prevent double booking
        await supabase
            .from('slots')
            .update({ status: 'blocked' })
            .eq('id', slotId);

        return NextResponse.json({
            checkoutUrl: session.url,
            sessionId: session.id,
        });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}