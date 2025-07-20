import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function PATCH(request: NextRequest) {
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

        // Get the slot data from the request body
        const body = await request.json();
        const { slotId, status } = body;

        if (!slotId || !status) {
            return NextResponse.json({ error: 'Slot ID and status are required' }, { status: 400 });
        }

        // Validate status
        if (!['available', 'blocked'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status. Must be "available" or "blocked"' }, { status: 400 });
        }

        // Get the slot data
        const { data: slot, error: slotError } = await supabase
            .from('slots')
            .select('*, turfs!inner(*)')
            .eq('id', slotId)
            .single();

        if (slotError) {
            return NextResponse.json({ error: slotError.message }, { status: 500 });
        }

        if (!slot) {
            return NextResponse.json({ error: 'Slot not found' }, { status: 404 });
        }

        // Check if the user is the owner of the turf
        if (slot.turfs.owner_id !== session.user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        // Check if the slot is already booked
        if (slot.status === 'booked') {
            return NextResponse.json({ error: 'Cannot modify a booked slot' }, { status: 400 });
        }

        // Update the slot status
        const { data: updatedSlot, error: updateError } = await supabase
            .from('slots')
            .update({ status })
            .eq('id', slotId)
            .select()
            .single();

        if (updateError) {
            return NextResponse.json({ error: updateError.message }, { status: 500 });
        }

        return NextResponse.json({ slot: updatedSlot });
    } catch (error) {
        console.error('Error updating slot status:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}