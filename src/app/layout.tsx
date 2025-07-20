import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Turfees - Book Sports Turfs in Seconds',
  description: 'Book and pay for turf slots in under 30 seconds. Find the perfect turf for your game.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen bg-slate-50">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}