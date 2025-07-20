export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            turfs: {
                Row: {
                    id: string
                    slug: string
                    google_place_id: string | null
                    name: string
                    description: string | null
                    photos: string[]
                    owner_id: string | null
                    base_price: number
                    amenities: string[]
                    location: unknown
                    open_hours: Json
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    slug: string
                    google_place_id?: string | null
                    name: string
                    description?: string | null
                    photos?: string[]
                    owner_id?: string | null
                    base_price: number
                    amenities?: string[]
                    location?: unknown
                    open_hours?: Json
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    slug?: string
                    google_place_id?: string | null
                    name?: string
                    description?: string | null
                    photos?: string[]
                    owner_id?: string | null
                    base_price?: number
                    amenities?: string[]
                    location?: unknown
                    open_hours?: Json
                    created_at?: string
                    updated_at?: string
                }
            }
            slots: {
                Row: {
                    id: string
                    turf_id: string
                    start_time: string
                    end_time: string
                    price: number
                    status: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    turf_id: string
                    start_time: string
                    end_time: string
                    price: number
                    status?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    turf_id?: string
                    start_time?: string
                    end_time?: string
                    price?: number
                    status?: string
                    created_at?: string
                }
            }
            bookings: {
                Row: {
                    id: string
                    slot_id: string
                    user_id: string
                    stripe_session_id: string | null
                    amount: number
                    status: string
                    qr_secret: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    slot_id: string
                    user_id: string
                    stripe_session_id?: string | null
                    amount: number
                    status?: string
                    qr_secret?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    slot_id?: string
                    user_id?: string
                    stripe_session_id?: string | null
                    amount?: number
                    status?: string
                    qr_secret?: string
                    created_at?: string
                }
            }
            reviews: {
                Row: {
                    id: string
                    booking_id: string
                    rating: number
                    comment: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    booking_id: string
                    rating: number
                    comment?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    booking_id?: string
                    rating?: number
                    comment?: string | null
                    created_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}