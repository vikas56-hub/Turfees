"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Home() {
  // State for location and sport filters
  const [selectedLocation, setSelectedLocation] = useState('Bangalore');
  const [selectedSport, setSelectedSport] = useState('Football');

  // Sample locations and sports for filters
  const locations = ['Bangalore', 'Mumbai', 'Delhi', 'Chennai', 'Hyderabad'];
  const sports = ['Football', 'Cricket', 'Badminton', 'Basketball', 'Tennis'];

  // Sample featured turfs (would come from API in production)
  const featuredTurfs = [
    {
      id: '1',
      slug: 'green-field-arena',
      name: 'Green Field Arena',
      location: 'Koramangala, Bangalore',
      rating: 4.8,
      reviews: 124,
      price: 1200,
      image: '/images/turf1.jpg',
      sports: ['Football', 'Cricket'],
      distance: '2.3 km'
    },
    {
      id: '2',
      name: 'Sports Village',
      location: 'Indiranagar, Bangalore',
      rating: 4.6,
      reviews: 98,
      price: 1500,
      image: '/images/turf2.jpg',
      sports: ['Football', 'Basketball'],
      distance: '3.1 km'
    },
    {
      id: '3',
      name: 'Play Arena',
      location: 'HSR Layout, Bangalore',
      rating: 4.9,
      reviews: 156,
      price: 1800,
      image: '/images/turf3.jpg',
      sports: ['Football', 'Tennis'],
      distance: '1.8 km'
    },
    {
      id: '4',
      name: 'Urban Kicks',
      location: 'Whitefield, Bangalore',
      rating: 4.7,
      reviews: 87,
      price: 1300,
      image: '/images/turf4.jpg',
      sports: ['Football'],
      distance: '5.2 km'
    }
  ];

  // State for booking stats (animated counters)
  const [bookingsToday, setBookingsToday] = useState(0);
  const [activePlayers, setActivePlayers] = useState(0);

  // Animate counters on load
  useEffect(() => {
    const bookingsInterval = setInterval(() => {
      setBookingsToday(prev => {
        if (prev < 127) return prev + 1;
        clearInterval(bookingsInterval);
        return prev;
      });
    }, 30);

    const playersInterval = setInterval(() => {
      setActivePlayers(prev => {
        if (prev < 543) return prev + 3;
        clearInterval(playersInterval);
        return prev;
      });
    }, 20);

    return () => {
      clearInterval(bookingsInterval);
      clearInterval(playersInterval);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Header />
      <main className="flex-grow">
        {/* Enhanced Hero Section with 3D Illustration */}
        <div className="relative bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 overflow-hidden shadow-[0_0_25px_rgba(6,182,212,0.5),0_0_15px_rgba(16,185,129,0.5)] border-b border-cyan-500/30">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")',
              backgroundSize: '20px 20px'
            }}></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 relative z-10">
            <div className="flex flex-col lg:flex-row items-center">
              {/* Left side: Text and Search */}
              <div className="w-full lg:w-1/2 text-left lg:pr-12 mb-10 lg:mb-0">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Book Sports Venues <br />
                  <span className="text-yellow-300">In Just 30 Seconds</span>
                </h1>
                <p className="mt-6 text-lg sm:text-xl text-white text-opacity-90 max-w-2xl">
                  Find and book the best turfs near you. No calls, no WhatsApp, just instant bookings.
                </p>

                {/* Stats Counter */}
                <div className="mt-8 flex space-x-8 text-white">
                  <div className="text-center">
                    <span className="block text-3xl sm:text-4xl font-bold text-yellow-300">
                      {bookingsToday}
                    </span>
                    <span className="text-sm sm:text-base">Bookings Today</span>
                  </div>
                  <div className="text-center">
                    <span className="block text-3xl sm:text-4xl font-bold text-yellow-300">
                      {activePlayers}
                    </span>
                    <span className="text-sm sm:text-base">Active Players</span>
                  </div>
                </div>

                {/* Search Box */}
                <div className="mt-10 bg-white rounded-lg shadow-xl p-4 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="relative">
                      <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <select
                        id="location"
                        name="location"
                        className="block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                      >
                        {locations.map(location => (
                          <option key={location} value={location}>{location}</option>
                        ))}
                      </select>
                    </div>

                    <div className="relative">
                      <label htmlFor="sport" className="block text-sm font-medium text-gray-700 mb-1">Sport</label>
                      <select
                        id="sport"
                        name="sport"
                        className="block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
                        value={selectedSport}
                        onChange={(e) => setSelectedSport(e.target.value)}
                      >
                        {sports.map(sport => (
                          <option key={sport} value={sport}>{sport}</option>
                        ))}
                      </select>
                    </div>

                    <div className="relative sm:flex sm:items-end">
                      <button
                        type="button"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-500 focus:ring-opacity-50 text-white py-3 px-4 rounded-md transition duration-200 ease-in-out transform hover:scale-[1.02] font-medium text-base flex items-center justify-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Find Turfs
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side: 3D Illustration */}
              <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
                <div className="relative w-full max-w-lg">
                  {/* Main 3D illustration - we're using a CSS-based illustration for now */}
                  <div className="relative z-10 w-full h-80 sm:h-96 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="w-32 h-32 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                        </div>
                        <div className="text-2xl font-bold">Turfees</div>
                        <div className="mt-2">Book • Play • Enjoy</div>
                      </div>
                    </div>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute top-10 -left-10 w-32 h-32 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                  <div className="absolute top-0 -right-4 w-32 h-32 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                  <div className="absolute -bottom-8 left-20 w-32 h-32 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

                  {/* Floating elements */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-white rounded-lg shadow-lg rotate-12 animate-float">
                    <div className="w-full h-full flex items-center justify-center text-emerald-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                      </svg>
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-8 w-16 h-16 bg-white rounded-lg shadow-lg -rotate-12 animate-float animation-delay-2000">
                    <div className="w-full h-full flex items-center justify-center text-emerald-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="absolute bottom-20 left-8 w-16 h-16 bg-white rounded-lg shadow-lg rotate-45 animate-float animation-delay-4000">
                    <div className="w-full h-full flex items-center justify-center text-emerald-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Featured Turfs Section */}
        <div className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Featured Turfs</h2>
              <Link href="/turfs" className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center">
                View All
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredTurfs.map((turf) => (
                <Link href={`/t/${turf.slug || turf.id}`} key={turf.id} className="group">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
                    <div className="relative h-48 w-full overflow-hidden">
                      <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                      {/* We'll use a placeholder color instead of actual images for now */}
                      <div className={`absolute inset-0 ${turf.id === '1' ? 'bg-emerald-200' :
                        turf.id === '2' ? 'bg-blue-200' :
                          turf.id === '3' ? 'bg-yellow-200' :
                            'bg-red-200'
                        }`}></div>
                      <div className="absolute top-0 right-0 bg-emerald-500 text-white px-2 py-1 text-xs font-bold m-2 rounded">
                        ₹{turf.price}/hr
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors duration-200">{turf.name}</h3>
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="ml-1 text-sm font-medium text-gray-700">{turf.rating}</span>
                          <span className="ml-1 text-xs text-gray-500">({turf.reviews})</span>
                        </div>
                      </div>

                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {turf.location}
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {turf.sports.map(sport => (
                            <span key={sport} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
                              {sport}
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">{turf.distance}</span>
                      </div>

                      <button className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded text-sm font-medium transition duration-200 ease-in-out transform hover:scale-[1.02]">
                        Book Now
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Sports Categories */}
        <div className="py-12 sm:py-16 bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">Browse by Sport</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6">
              {[
                { name: 'Football', icon: '⚽', color: 'bg-green-100' },
                { name: 'Cricket', icon: '🏏', color: 'bg-blue-100' },
                { name: 'Badminton', icon: '🏸', color: 'bg-yellow-100' },
                { name: 'Basketball', icon: '🏀', color: 'bg-orange-100' },
                { name: 'Tennis', icon: '🎾', color: 'bg-red-100' },
              ].map((sport) => (
                <Link href={`/sports/${sport.name.toLowerCase()}`} key={sport.name} className="group">
                  <div className={`${sport.color} rounded-lg p-6 text-center transition-all duration-300 hover:shadow-md`}>
                    <div className="text-4xl mb-3">{sport.icon}</div>
                    <h3 className="font-medium text-gray-900">{sport.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-white">How Turfees Works</h2>
              <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
                Book your favorite sports venue in three simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: 1,
                  title: 'Find a Turf',
                  description: 'Search for turfs by location, sport, or browse through our listings.',
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )
                },
                {
                  step: 2,
                  title: 'Select a Slot',
                  description: 'Choose from available time slots that fit your schedule.',
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )
                },
                {
                  step: 3,
                  title: 'Pay & Play',
                  description: 'Make a secure payment and receive your QR ticket instantly.',
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )
                }
              ].map((item) => (
                <div key={item.step} className="bg-white rounded-lg shadow-md p-6 relative group hover:shadow-lg transition-all duration-300">
                  <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform duration-300">
                    {item.step}
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4">{item.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-emerald-700">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              <span className="block">Ready to start booking?</span>
              <span className="block text-emerald-200">Join thousands of players today.</span>
            </h2>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <Link
                  href="/turfs"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-emerald-700 bg-white hover:bg-emerald-50 transition duration-200"
                >
                  Find Turfs
                </Link>
              </div>
              <div className="ml-3 inline-flex rounded-md shadow">
                <Link
                  href="/onboard"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-500 transition duration-200"
                >
                  Add Your Turf
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Mobile Bottom Navigation */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 px-4 z-50">
        <Link href="/" className="flex flex-col items-center text-emerald-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-xs">Home</span>
        </Link>
        <Link href="/turfs" className="flex flex-col items-center text-gray-500 hover:text-emerald-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-xs">Search</span>
        </Link>
        <Link href="/bookings" className="flex flex-col items-center text-gray-500 hover:text-emerald-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs">Bookings</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center text-gray-500 hover:text-emerald-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-xs">Profile</span>
        </Link>
      </div>

      {/* Add custom styles for animations */}
      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}