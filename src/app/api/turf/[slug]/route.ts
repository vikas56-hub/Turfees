import { NextRequest, NextResponse } from 'next/server';
import { demoTurfs } from '@/lib/demoData';
import { Turf, Slot } from '@/types';

// Generate demo slots for the next 7 days
function generateDemoSlots(turfId: string): Slot[] {
    const slots: Slot[] = [];
    const today = new Date();

    // Generate slots for next 7 days
    for (let day = 0; day < 7; day++) {
        const date = new Date(today);
        date.setDate(today.getDate() + day);

        // Generate slots from 6 AM to 10 PM (every hour)
        for (let hour = 6; hour < 22; hour++) {
            const startTime = new Date(date);
            startTime.setHours(hour, 0, 0, 0);

            const endTime = new Date(startTime);
            endTime.setHours(hour + 1, 0, 0, 0);

            // Randomly make some slots booked for demo
            const isBooked = Math.random() < 0.3; // 30% chance of being booked

            slots.push({
                id: `slot-${turfId}-${day}-${hour}`,
                turf_id: turfId,
                start_time: startTime.toISOString(),
                end_time: endTime.toISOString(),
                price: 120000, // ₹1200 in paise
                status: isBooked ? 'booked' : 'available',
                created_at: new Date().toISOString()
            });
        }
    }

    return slots;
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    try {
        // Find turf by slug in demo data
        const turf = demoTurfs.find(t => t.slug === slug);

        if (!turf) {
            return NextResponse.json({ error: 'Turf not found' }, { status: 404 });
        }

        // Convert demo turf to proper format
        const formattedTurf: Turf = {
            id: turf.id,
            slug: turf.slug,
            name: turf.name,
            description: turf.description,
            photos: turf.photos,
            owner_id: turf.owner_id,
            base_price: turf.base_price * 100, // Convert to paise
            amenities: turf.amenities,
            location: { x: 0, y: 0 }, // Demo location
            open_hours: turf.open_hours,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        // Generate demo slots
        const slots = generateDemoSlots(turf.id);

        return NextResponse.json({ turf: formattedTurf, slots });
    } catch (error) {
        console.error('Error fetching turf data:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}