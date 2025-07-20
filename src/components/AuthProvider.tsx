'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

type AuthContextType = {
    user: User | null;
    session: Session | null;
    isLoading: boolean;
    signIn: (email: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        const getInitialSession = async () => {
            setIsLoading(true);

            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) {
                console.error('Error getting session:', error);
            }

            setSession(session);
            setUser(session?.user ?? null);
            setIsLoading(false);
        };

        getInitialSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session);
                setUser(session?.user ?? null);
                setIsLoading(false);
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const signIn = async (email: string) => {
        setIsLoading(true);

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            console.error('Error signing in:', error);
            throw error;
        }

        setIsLoading(false);
    };

    const signInWithGoogle = async () => {
        setIsLoading(true);

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            console.error('Error signing in with Google:', error);
            throw error;
        }

        setIsLoading(false);
    };

    const signOut = async () => {
        setIsLoading(true);

        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error('Error signing out:', error);
            throw error;
        }

        setIsLoading(false);
    };

    const value = {
        user,
        session,
        isLoading,
        signIn,
        signInWithGoogle,
        signOut,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}