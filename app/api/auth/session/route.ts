import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        const { idToken } = await req.json();

        // Exchange Firebase ID token for a session cookie with Flask
        const response = await fetch('http://localhost:5328/auth/session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idToken }),
        });

        if (!response.ok) throw new Error('Failed to create session');

        const { sessionCookie } = await response.json();

        // Set the session cookie
        const cookieStore = await cookies();
        cookieStore.set('session', sessionCookie, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 5 // 5 days
        });

        return NextResponse.json({ status: 'success' });
    } catch (error) {
        console.error('Session creation error:', error);
        return NextResponse.json(
            { error: 'Failed to create session' },
            { status: 500 }
        );
    }
} 