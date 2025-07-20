import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);

    // In a real implementation, this would handle authentication callbacks
    // For now, we'll just redirect to the home page

    // URL to redirect to after sign in process completes
    return NextResponse.redirect(requestUrl.origin);
}