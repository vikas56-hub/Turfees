import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
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

        const slug = params.slug;

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

        // Check if the user is the owner of the turf
        if (turf.owner_id !== session.user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        // Get today's bookings
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const { data: slots, error: slotsError } = await supabase
            .from('slots')
            .select(`
        *,
        bookings:bookings(
          *,
          user:user_id(
            id,
            email
          )
        )
      `)
            .eq('turf_id', turf.id)
            .gte('start_time', today.toISOString())
            .lt('start_time', tomorrow.toISOString())
            .order('start_time', { ascending: true });

        if (slotsError) {
            return NextResponse.json({ error: slotsError.message }, { status: 500 });
        }

        // Get total earnings
        const { data: earnings, error: earningsError } = await supabase
            .from('bookings')
            .select('amount')
            .eq('status', 'confirmed')
            .in('slot_id', slots.map(slot => slot.id));

        if (earningsError) {
            return NextResponse.json({ error: earningsError.message }, { status: 500 });
        }

        const totalEarnings = earnings.reduce((total, booking) => total + booking.amount, 0);

        return NextResponse.json({ turf, slots, totalEarnings });
    } catch (error) {
        console.error('Error fetching turf data:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
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

        const slug = params.slug;

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

        // Check if the user is the owner of the turf
        if (turf.owner_id !== session.user.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        // Get the updated turf data from the request body
        const body = await request.json();
        const { name, description, base_price, amenities, open_hours } = body;

        // Update the turf
        const { data: updatedTurf, error: updateError } = await supabase
            .from('turfs')
            .update({
                name: name || turf.name,
                description: description || turf.description,
                base_price: base_price || turf.base_price,
                amenities: amenities || turf.amenities,
                open_hours: open_hours || turf.open_hours,
                updated_at: new Date().toISOString(),
            })
            .eq('id', turf.id)
            .select()
            .single();

        if (updateError) {
            return NextResponse.json({ error: updateError.message }, { status: 500 });
        }

        return NextResponse.json({ turf: updatedTurf });
    } catch (error) {
        console.error('Error updating turf data:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}