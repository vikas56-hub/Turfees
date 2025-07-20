// Demo data for testing purposes

export const demoUsers = [
    {
        id: 'user-1',
        name: 'John Player',
        email: 'player@example.com',
        phone: '9876543210',
        role: 'player',
        password: 'player123' // In a real app, passwords would be hashed
    },
    {
        id: 'user-2',
        name: 'Mike Owner',
        email: 'owner@example.com',
        phone: '9876543211',
        role: 'owner',
        password: 'owner123' // In a real app, passwords would be hashed
    }
];

export const demoTurfs = [
    {
        id: 'turf-1',
        name: 'Green Field Arena',
        slug: 'green-field-arena',
        description: 'A premium football turf with floodlights and changing rooms.',
        address: '123 Main St, Koramangala, Bangalore',
        photos: ['/images/turf1.jpg', '/images/turf2.jpg'],
        owner_id: 'user-2',
        base_price: 1200, // in rupees
        amenities: ['Changing Rooms', 'Parking', 'Washrooms', 'Floodlights'],
        rating: 4.8,
        reviews: 124,
        open_hours: {
            mon: { start: '06:00', end: '22:00' },
            tue: { start: '06:00', end: '22:00' },
            wed: { start: '06:00', end: '22:00' },
            thu: { start: '06:00', end: '22:00' },
            fri: { start: '06:00', end: '22:00' },
            sat: { start: '06:00', end: '22:00' },
            sun: { start: '06:00', end: '22:00' }
        }
    }
];

// Function to initialize demo data in localStorage
export function initializeDemoData() {
    if (typeof window !== 'undefined') {
        localStorage.setItem('demoUsers', JSON.stringify(demoUsers));
        localStorage.setItem('demoTurfs', JSON.stringify(demoTurfs));
    }
}

// Function to check login credentials
export function checkCredentials(emailOrPhone: string, password: string) {
    const users = JSON.parse(localStorage.getItem('demoUsers') || '[]');

    const user = users.find(
        (u: any) => (u.email === emailOrPhone || u.phone === emailOrPhone) && u.password === password
    );

    if (user) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role
        }));
        return true;
    }

    return false;
}