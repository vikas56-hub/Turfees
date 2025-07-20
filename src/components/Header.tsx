"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthModal from './auth/AuthModal';

export default function Header() {
    const router = useRouter();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [isScrolled, setIsScrolled] = useState(false);

    // Check authentication status on component mount
    useEffect(() => {
        const checkAuth = () => {
            const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
            setIsLoggedIn(loggedIn);

            if (loggedIn) {
                const userData = JSON.parse(localStorage.getItem('currentUser') || '{}');
                setUser(userData);
            }
        };

        // Check auth on mount and whenever localStorage changes
        checkAuth();

        // Listen for storage events (when localStorage changes in another tab)
        window.addEventListener('storage', checkAuth);

        // Add scroll event listener
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('storage', checkAuth);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Handle logout
    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        setIsLoggedIn(false);
        setUser(null);
        router.push('/');
    };

    return (
        <header className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center">
                        {/* Logo */}
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <span className={`text-2xl font-bold transition-colors duration-300 ${isScrolled ? 'text-emerald-600' : 'text-white'}`}>
                                Turfees
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:ml-10 md:flex md:space-x-8">
                            <Link
                                href="/turfs"
                                className={`inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium hover:border-gray-300 transition-colors duration-300 ${isScrolled ? 'text-gray-500 hover:text-gray-700' : 'text-white hover:text-gray-200'}`}
                            >
                                Find Turfs
                            </Link>
                            <Link
                                href="/sports"
                                className={`inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium hover:border-gray-300 transition-colors duration-300 ${isScrolled ? 'text-gray-500 hover:text-gray-700' : 'text-white hover:text-gray-200'}`}
                            >
                                Sports
                            </Link>
                            <Link
                                href="/about"
                                className={`inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium hover:border-gray-300 transition-colors duration-300 ${isScrolled ? 'text-gray-500 hover:text-gray-700' : 'text-white hover:text-gray-200'}`}
                            >
                                About
                            </Link>
                            <Link
                                href="/contact"
                                className={`inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium hover:border-gray-300 transition-colors duration-300 ${isScrolled ? 'text-gray-500 hover:text-gray-700' : 'text-white hover:text-gray-200'}`}
                            >
                                Contact
                            </Link>
                        </nav>
                    </div>

                    <div className="flex items-center">
                        {/* Add Turf Button */}
                        <Link
                            href={isLoggedIn ? "/onboard" : "#"}
                            onClick={(e) => {
                                if (!isLoggedIn) {
                                    e.preventDefault();
                                    setIsAuthModalOpen(true);
                                }
                            }}
                            className={`hidden md:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md transition-all duration-300 mr-4 ${isScrolled
                                    ? 'text-white bg-emerald-600 hover:bg-emerald-700'
                                    : 'text-emerald-700 bg-white hover:bg-gray-100'
                                }`}
                        >
                            Add Your Turf
                        </Link>

                        {/* Login/Signup Button or User Menu */}
                        {isLoggedIn ? (
                            <div className="relative ml-3">
                                <Link
                                    href="/dashboard"
                                    className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md transition-all duration-300 ${isScrolled
                                            ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                                            : 'border-white text-white hover:bg-white hover:bg-opacity-10'
                                        }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${isScrolled ? 'text-emerald-500' : 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    {user?.name || 'Dashboard'}
                                </Link>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsAuthModalOpen(true)}
                                className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md transition-all duration-300 ${isScrolled
                                        ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                                        : 'border-white text-white hover:bg-white hover:bg-opacity-10'
                                    }`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Login / Signup
                            </button>
                        )}

                        {/* Mobile menu button */}
                        <div className="flex items-center md:hidden ml-4">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className={`inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500 ${isScrolled
                                        ? 'text-gray-400 hover:text-gray-500 hover:bg-gray-100'
                                        : 'text-white hover:text-gray-200 hover:bg-white hover:bg-opacity-10'
                                    }`}
                            >
                                <span className="sr-only">Open main menu</span>
                                {isMobileMenuOpen ? (
                                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
                <div className={`md:hidden ${isScrolled ? 'bg-white' : 'bg-emerald-800 bg-opacity-95'}`}>
                    <div className="pt-2 pb-3 space-y-1">
                        <Link
                            href="/turfs"
                            className={`block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium ${isScrolled
                                    ? 'text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                                    : 'text-white hover:bg-emerald-700 hover:border-white'
                                }`}
                        >
                            Find Turfs
                        </Link>
                        <Link
                            href="/sports"
                            className={`block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium ${isScrolled
                                    ? 'text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                                    : 'text-white hover:bg-emerald-700 hover:border-white'
                                }`}
                        >
                            Sports
                        </Link>
                        <Link
                            href="/about"
                            className={`block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium ${isScrolled
                                    ? 'text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                                    : 'text-white hover:bg-emerald-700 hover:border-white'
                                }`}
                        >
                            About
                        </Link>
                        <Link
                            href="/contact"
                            className={`block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium ${isScrolled
                                    ? 'text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                                    : 'text-white hover:bg-emerald-700 hover:border-white'
                                }`}
                        >
                            Contact
                        </Link>
                        {isLoggedIn && (
                            <Link
                                href="/dashboard"
                                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${isScrolled
                                        ? 'border-emerald-500 text-emerald-700 bg-emerald-50'
                                        : 'border-white text-white bg-emerald-700'
                                    }`}
                            >
                                Dashboard
                            </Link>
                        )}
                        <Link
                            href={isLoggedIn ? "/onboard" : "#"}
                            onClick={(e) => {
                                if (!isLoggedIn) {
                                    e.preventDefault();
                                    setIsAuthModalOpen(true);
                                }
                            }}
                            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${isScrolled
                                    ? 'border-transparent text-emerald-600 hover:bg-gray-50 hover:border-emerald-300 hover:text-emerald-800'
                                    : 'border-transparent text-white hover:bg-emerald-700 hover:border-white'
                                }`}
                        >
                            Add Your Turf
                        </Link>
                        {isLoggedIn && (
                            <button
                                onClick={handleLogout}
                                className={`block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium ${isScrolled
                                        ? 'text-red-600 hover:bg-gray-50 hover:border-red-300 hover:text-red-800'
                                        : 'text-red-300 hover:bg-emerald-700 hover:border-red-300 hover:text-red-200'
                                    }`}
                            >
                                Logout
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Auth Modal */}
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        </header>
    );
}