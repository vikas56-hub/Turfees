declare module 'next-pwa' {
    import { NextConfig } from 'next';

    interface PWAOptions {
        dest?: string;
        register?: boolean;
        skipWaiting?: boolean;
        disable?: boolean;
        runtimeCaching?: Array<{
            urlPattern: RegExp;
            handler: string;
            options?: {
                cacheName?: string;
                expiration?: {
                    maxEntries?: number;
                    maxAgeSeconds?: number;
                };
                networkTimeoutSeconds?: number;
            };
        }>;
    }

    type WithPWA = (nextConfig?: NextConfig) => NextConfig;

    const withPWA: (options?: PWAOptions) => WithPWA;

    export default withPWA;
}