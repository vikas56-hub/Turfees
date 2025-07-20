import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        // Demo booking data for testing
        const mockBooking = {
            id: id,
            slot_id: 'slot-1',
            user_id: 'user-1',
            amount: 120000, // ₹1200 in paise
            status: 'confirmed',
            created_at: new Date().toISOString(),
            qr_secret: 'demo-qr-secret'
        };

        const mockSlot = {
            id: 'slot-1',
            start_time: new Date().toISOString(),
            end_time: new Date(Date.now() + 3600000).toISOString(),
            price: 120000
        };

        const mockTurf = {
            id: 'turf-1',
            name: 'Green Field Arena',
            slug: 'green-field-arena',
            description: 'A premium football turf'
        };

        return NextResponse.json({
            booking: mockBooking,
            slot: mockSlot,
            turf: mockTurf
        });
    } catch (error) {
        console.error('Error fetching booking data:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}