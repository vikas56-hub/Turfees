export interface Turf {
    id: string;
    slug: string;
    name: string;
    description?: string;
    photos: string[];
    owner_id: string;
    base_price: number; // in paise
    amenities: string[];
    location: {
        x: number;
        y: number;
    };
    open_hours: {
        [key: string]: {
            start: string;
            end: string;
        };
    };
    created_at: string;
    updated_at: string;
}

export interface Slot {
    id: string;
    turf_id: string;
    start_time: string;
    end_time: string;
    price: number; // in paise
    status: 'available' | 'booked' | 'blocked';
    created_at: string;
}

export interface Booking {
    id: string;
    slot_id: string;
    user_id: string;
    stripe_session_id: string;
    amount: number; // in paise
    status: 'pending' | 'confirmed' | 'cancelled';
    qr_secret: string;
    created_at: string;
}

export interface Review {
    id: string;
    booking_id: string;
    rating: number;
    comment?: string;
    created_at: string;
}

export interface User {
    id: string;
    email: string;
    name?: string;
    phone?: string;
}

export interface TurfResponse {
    turf: Turf;
    slots: Slot[];
}

export interface CheckoutRequest {
    slotId: string;
}

export interface CheckoutResponse {
    checkoutUrl: string;
    sessionId: string;
}