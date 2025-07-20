"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthModal from '@/components/auth/AuthModal';

// Mock Google Places API response for demo purposes
const mockPlacesResults = [
    {
        id: 'place1',
        name: 'Green Field Arena',
        address: '123 Main St, Koramangala, Bangalore',
        photos: ['https://via.placeholder.com/400x300?text=Turf+Photo'],
        rating: 4.8,
        types: ['stadium', 'sports_complex']
    },
    {
        id: 'place2',
        name: 'Sports Village',
        address: '456 Park Ave, Indiranagar, Bangalore',
        photos: ['https://via.placeholder.com/400x300?text=Turf+Photo'],
        rating: 4.6,
        types: ['stadium', 'sports_complex']
    },
    {
        id: 'place3',
        name: 'Play Arena',
        address: '789 Game St, HSR Layout, Bangalore',
        photos: ['https://via.placeholder.com/400x300?text=Turf+Photo'],
        rating: 4.9,
        types: ['stadium', 'sports_complex']
    }
];

export default function OnboardPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        address: '',
        photos: [],
        amenities: [],
        basePrice: 1000,
        openHours: {
            mon: { start: '06:00', end: '22:00' },
            tue: { start: '06:00', end: '22:00' },
            wed: { start: '06:00', end: '22:00' },
            thu: { start: '06:00', end: '22:00' },
            fri: { start: '06:00', end: '22:00' },
            sat: { start: '06:00', end: '22:00' },
            sun: { start: '06:00', end: '22:00' }
        }
    });
    const [generatedSlug, setGeneratedSlug] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Check authentication status
    useEffect(() => {
        // In a real app, check if user is authenticated with Supabase
        // For demo, we'll just simulate this
        const checkAuth = async () => {
            // Simulate auth check
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            setIsAuthenticated(isLoggedIn);

            // If not authenticated and on step 1, show auth modal
            if (!isLoggedIn && step === 1) {
                setIsAuthModalOpen(true);
            }
        };

        checkAuth();
    }, [step]);

    // Handle search for Google Places
    const handleSearch = () => {
        if (searchQuery.trim() === '') return;

        setIsSearching(true);

        // In a real app, this would call the Google Places API
        // For demo, we'll use mock data
        setTimeout(() => {
            setSearchResults(mockPlacesResults.filter(place =>
                place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                place.address.toLowerCase().includes(searchQuery.toLowerCase())
            ));
            setIsSearching(false);
        }, 1000);
    };

    // Handle place selection
    const handleSelectPlace = (place) => {
        setSelectedPlace(place);
        setFormData({
            ...formData,
            name: place.name,
            address: place.address,
            photos: place.photos
        });
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle amenity toggle
    const handleAmenityToggle = (amenity) => {
        const updatedAmenities = formData.amenities.includes(amenity)
            ? formData.amenities.filter(a => a !== amenity)
            : [...formData.amenities, amenity];

        setFormData({
            ...formData,
            amenities: updatedAmenities
        });
    };

    // Handle operating hours change
    const handleHoursChange = (day, type, value) => {
        setFormData({
            ...formData,
            openHours: {
                ...formData.openHours,
                [day]: {
                    ...formData.openHours[day],
                    [type]: value
                }
            }
        });
    };

    // Handle photo upload
    const handlePhotoUpload = (e) => {
        const files = Array.from(e.target.files);

        // Check file size (max 2MB)
        const validFiles = files.filter(file => file.size <= 2 * 1024 * 1024);

        if (validFiles.length < files.length) {
            setError('Some files were skipped because they exceed the 2MB limit');
        }

        // Limit to 3 photos
        const newPhotos = [...formData.photos];
        validFiles.forEach(file => {
            if (newPhotos.length < 3) {
                // In a real app, we would upload to Supabase Storage
                // For demo, we'll create object URLs
                newPhotos.push(URL.createObjectURL(file));
            }
        });

        setFormData({
            ...formData,
            photos: newPhotos
        });
    };

    // Handle form submission
    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError('');

        try {
            // Generate slug from name
            const slug = formData.name
                .toLowerCase()
                .replace(/[^\w ]+/g, '')
                .replace(/ +/g, '-');

            // In a real app, this would call the API to create the turf
            // For demo, we'll simulate this
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Set generated slug (would come from API in real app)
            setGeneratedSlug(`${slug}-${Math.random().toString(36).substring(2, 7)}`);

            setStep(4); // Move to success step
        } catch (err) {
            setError('Failed to create turf. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle copy to clipboard
    const handleCopyUrl = () => {
        const url = `https://turfees.app/t/${generatedSlug}`;
        navigator.clipboard.writeText(url);
        alert('URL copied to clipboard!');
    };

    // Simulate login for demo
    const handleLogin = () => {
        localStorage.setItem('isLoggedIn', 'true');
        setIsAuthenticated(true);
        setIsAuthModalOpen(false);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            <main className="flex-grow py-10">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Progress Steps */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            {[1, 2, 3, 4].map((s) => (
                                <div key={s} className="flex flex-col items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= s ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'
                                        }`}>
                                        {s}
                                    </div>
                                    <div className="text-xs mt-1 text-gray-500">
                                        {s === 1 && 'Find Turf'}
                                        {s === 2 && 'Details'}
                                        {s === 3 && 'Pricing'}
                                        {s === 4 && 'Complete'}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-2 h-1 bg-gray-200 rounded-full">
                            <div
                                className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                                style={{ width: `${(step - 1) * 33.33}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Step 1: Find Turf */}
                    {step === 1 && (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Find Your Turf</h2>
                            <p className="text-gray-600 mb-6">
                                Search for your turf on Google Maps to quickly import details. If your turf isn&apos;t listed, you can add it manually in the next step.
                            </p>

                            <div className="flex mb-4">
                                <input
                                    type="text"
                                    placeholder="Search for your turf by name or address"
                                    className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                />
                                <button
                                    className="bg-emerald-600 text-white px-4 py-2 rounded-r-md hover:bg-emerald-700 transition duration-200"
                                    onClick={handleSearch}
                                    disabled={isSearching}
                                >
                                    {isSearching ? (
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : 'Search'}
                                </button>
                            </div>

                            {/* Search Results */}
                            {searchResults.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-3">Search Results</h3>
                                    <div className="space-y-4">
                                        {searchResults.map((place) => (
                                            <div
                                                key={place.id}
                                                className={`border rounded-lg p-4 cursor-pointer transition duration-200 ${selectedPlace?.id === place.id ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-emerald-300'
                                                    }`}
                                                onClick={() => handleSelectPlace(place)}
                                            >
                                                <div className="flex items-start">
                                                    <div className="w-16 h-16 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                                                        <div className="w-full h-full bg-emerald-200 flex items-center justify-center text-emerald-700">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div className="ml-4 flex-grow">
                                                        <h4 className="font-medium text-gray-900">{place.name}</h4>
                                                        <p className="text-sm text-gray-500">{place.address}</p>
                                                        <div className="flex items-center mt-1">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                            </svg>
                                                            <span className="ml-1 text-sm text-gray-600">{place.rating}</span>
                                                        </div>
                                                    </div>
                                                    {selectedPlace?.id === place.id && (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mt-8 flex justify-between">
                                <button
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-200"
                                    onClick={() => router.push('/')}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() => setStep(2)}
                                    disabled={!selectedPlace && searchResults.length > 0}
                                >
                                    {selectedPlace ? 'Continue with Selected Turf' : 'Add Manually'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Turf Details */}
                    {step === 2 && (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Turf Details</h2>

                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Turf Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                        Description <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                        placeholder="Describe your turf, including surface type, lighting, etc."
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                        Address <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Photos (Max 3, each under 2MB)
                                    </label>
                                    <div className="mt-1 flex items-center space-x-4">
                                        {[0, 1, 2].map((index) => (
                                            <div key={index} className="relative w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
                                                {formData.photos[index] ? (
                                                    <div className="relative w-full h-full">
                                                        <div className="absolute inset-0 bg-emerald-200 flex items-center justify-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                                                            onClick={() => setFormData({
                                                                ...formData,
                                                                photos: formData.photos.filter((_, i) => i !== index)
                                                            })}
                                                        >
                                                            &times;
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <label className="cursor-pointer w-full h-full flex items-center justify-center">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                        </svg>
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            accept="image/*"
                                                            onChange={handlePhotoUpload}
                                                            disabled={formData.photos.length >= 3}
                                                        />
                                                    </label>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <p className="mt-2 text-xs text-gray-500">
                                        Upload up to 3 high-quality photos of your turf. Each photo must be under 2MB.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Amenities
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['Changing Rooms', 'Parking', 'Washrooms', 'Drinking Water', 'Floodlights', 'Equipment Rental', 'Seating Area', 'Cafeteria'].map((amenity) => (
                                            <div key={amenity} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id={`amenity-${amenity}`}
                                                    checked={formData.amenities.includes(amenity)}
                                                    onChange={() => handleAmenityToggle(amenity)}
                                                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                                                />
                                                <label htmlFor={`amenity-${amenity}`} className="ml-2 text-sm text-gray-700">
                                                    {amenity}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="mt-4 text-sm text-red-600">
                                    {error}
                                </div>
                            )}

                            <div className="mt-8 flex justify-between">
                                <button
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-200"
                                    onClick={() => setStep(1)}
                                >
                                    Back
                                </button>
                                <button
                                    className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition duration-200"
                                    onClick={() => setStep(3)}
                                    disabled={!formData.name || !formData.description || !formData.address}
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Pricing & Availability */}
                    {step === 3 && (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Pricing & Availability</h2>

                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700 mb-1">
                                        Base Price (₹ per hour) <span className="text-red-500">*</span>
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">₹</span>
                                        </div>
                                        <input
                                            type="number"
                                            id="basePrice"
                                            name="basePrice"
                                            value={formData.basePrice}
                                            onChange={handleInputChange}
                                            className="block w-full pl-7 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                            placeholder="0.00"
                                            min="100"
                                            required
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500 sm:text-sm">/hour</span>
                                        </div>
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500">
                                        This is your standard hourly rate. You can set peak pricing later in your dashboard.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Operating Hours
                                    </label>
                                    <div className="space-y-3">
                                        {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map((day) => (
                                            <div key={day} className="grid grid-cols-3 gap-4 items-center">
                                                <div className="text-sm font-medium text-gray-700">
                                                    {day === 'mon' && 'Monday'}
                                                    {day === 'tue' && 'Tuesday'}
                                                    {day === 'wed' && 'Wednesday'}
                                                    {day === 'thu' && 'Thursday'}
                                                    {day === 'fri' && 'Friday'}
                                                    {day === 'sat' && 'Saturday'}
                                                    {day === 'sun' && 'Sunday'}
                                                </div>
                                                <div>
                                                    <input
                                                        type="time"
                                                        value={formData.openHours[day].start}
                                                        onChange={(e) => handleHoursChange(day, 'start', e.target.value)}
                                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                                    />
                                                </div>
                                                <div>
                                                    <input
                                                        type="time"
                                                        value={formData.openHours[day].end}
                                                        onChange={(e) => handleHoursChange(day, 'end', e.target.value)}
                                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-between">
                                <button
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-200"
                                    onClick={() => setStep(2)}
                                >
                                    Back
                                </button>
                                <button
                                    className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition duration-200 flex items-center"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting || !formData.basePrice}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Creating...
                                        </>
                                    ) : 'Create Turf Page'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Success */}
                    {step === 4 && (
                        <div className="bg-white rounded-lg shadow-md p-6 text-center">
                            <div className="w-16 h-16 bg-emerald-100 rounded-full mx-auto flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            <h2 className="text-2xl font-bold text-gray-900 mt-6 mb-2">Your Turf Page is Live!</h2>
                            <p className="text-gray-600 mb-6">
                                Your turf has been successfully added to Turfees. Share your unique URL with customers to start accepting bookings.
                            </p>

                            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                <p className="text-sm text-gray-500 mb-2">Your Turf URL</p>
                                <div className="flex">
                                    <input
                                        type="text"
                                        value={`https://turfees.app/t/${generatedSlug}`}
                                        readOnly
                                        className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md bg-white focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                    />
                                    <button
                                        className="bg-emerald-600 text-white px-4 py-2 rounded-r-md hover:bg-emerald-700 transition duration-200"
                                        onClick={handleCopyUrl}
                                    >
                                        Copy
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <button
                                    className="w-full px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition duration-200"
                                    onClick={() => router.push(`/t/${generatedSlug}`)}
                                >
                                    View Your Turf Page
                                </button>

                                <button
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-200"
                                    onClick={() => router.push('/admin/dashboard')}
                                >
                                    Go to Owner Dashboard
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />

            {/* Auth Modal */}
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => {
                    setIsAuthModalOpen(false);
                    // For demo purposes, simulate login
                    handleLogin();
                }}
            />
        </div>
    );
}