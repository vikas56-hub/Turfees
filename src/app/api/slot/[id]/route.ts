import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;

        if (!id) {
            return NextResponse.json({ error: 'Slot ID is required' }, { status: 400 });
        }

        // Get slot data with turf information
        const { data: slot, error: slotError } = await supabase
            .from('slots')
            .select('*, turfs(*)')
            .eq('id', id)
            .single();

        if (slotError) {
            return NextResponse.json({ error: slotError.message }, { status: 500 });
        }

        if (!slot) {
            return NextResponse.json({ error: 'Slot not found' }, { status: 404 });
        }

        // Extract turf data from the joined query
        const turf = slot.turfs;
        delete slot.turfs;

        return NextResponse.json({ slot, turf });
    } catch (error) {
        console.error('Error fetching slot data:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}