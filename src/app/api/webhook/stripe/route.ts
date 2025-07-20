import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { stripe } from '@/lib/stripe';
import { Readable } from 'stream';

// Helper function to read the request body as a string
async function readBody(readable: ReadableStream<Uint8Array>): Promise<string> {
    const reader = readable.getReader();
    const decoder = new TextDecoder();
    let body = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        body += decoder.decode(value, { stream: true });
    }

    return body;
}

export async function POST(request: NextRequest) {
    try {
        const body = await readBody(request.body!);
        const signature = request.headers.get('stripe-signature')!;

        let event;
        try {
            event = stripe.webhooks.constructEvent(
                body,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET!
            );
        } catch (err: any) {
            console.error(`Webhook signature verification failed: ${err.message}`);
            return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
        }

        // Handle the event
        switch (event.type) {
            case 'checkout.session.completed':
                await handleCheckoutSessionCompleted(event.data.object);
                break;
            case 'checkout.session.expired':
                await handleCheckoutSessionExpired(event.data.object);
                break;
            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Error handling webhook:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

async function handleCheckoutSessionCompleted(session: any) {
    const { slotId, userId } = session.metadata;

    // Update booking status
    const { error: bookingError } = await supabase
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('stripe_session_id', session.id);

    if (bookingError) {
        console.error('Error updating booking:', bookingError);
        return;
    }

    // Update slot status
    const { error: slotError } = await supabase
        .from('slots')
        .update({ status: 'booked' })
        .eq('id', slotId);

    if (slotError) {
        console.error('Error updating slot:', slotError);
    }

    // TODO: Send confirmation email
}

async function handleCheckoutSessionExpired(session: any) {
    const { slotId } = session.metadata;

    // Update booking status
    const { error: bookingError } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('stripe_session_id', session.id);

    if (bookingError) {
        console.error('Error updating booking:', bookingError);
        return;
    }

    // Release the slot
    const { error: slotError } = await supabase
        .from('slots')
        .update({ status: 'available' })
        .eq('id', slotId);

    if (slotError) {
        console.error('Error updating slot:', slotError);
    }
}