import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const slug = searchParams.get('slug');

        if (!slug) {
            return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
        }

        // Get turf data
        const { data: turf, error: turfError } = await supabase
            .from('turfs')
            .select('*')
            .eq('slug', slug)
            .single();

        if (turfError) {
            return NextResponse.json({ error: turfError.message }, { status: 500 });
        }

        if (!turf) {
            return NextResponse.json({ error: 'Turf not found' }, { status: 404 });
        }

        // Get slots for today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const { data: slots, error: slotsError } = await supabase
            .from('slots')
            .select('*')
            .eq('turf_id', turf.id)
            .gte('start_time', today.toISOString())
            .lt('start_time', tomorrow.toISOString())
            .order('start_time', { ascending: true });

        if (slotsError) {
            return NextResponse.json({ error: slotsError.message }, { status: 500 });
        }

        return NextResponse.json({ turf, slots });
    } catch (error) {
        console.error('Error fetching turf data:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, description, basePrice, photos, openHours, amenities } = body;

        // Generate slug from name
        const slug = name.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');

        // Check if slug already exists
        const { data: existingTurf } = await supabase
            .from('turfs')
            .select('id')
            .eq('slug', slug)
            .single();

        let finalSlug = slug;
        if (existingTurf) {
            // Append random string to make slug unique
            finalSlug = `${slug}-${Math.random().toString(36).substring(2, 7)}`;
        }

        // Insert turf
        const { data: turf, error } = await supabase
            .from('turfs')
            .insert({
                slug: finalSlug,
                name,
                description,
                base_price: basePrice,
                photos: photos || [],
                open_hours: openHours,
                amenities: amenities || [],
            })
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ turf });
    } catch (error) {
        console.error('Error creating turf:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}