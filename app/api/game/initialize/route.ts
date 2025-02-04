import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        // Get data and token from the frontend request
        const { gameType, imageCount, idToken } = await req.json();
        
        if (!idToken) {
            return NextResponse.json(
                { error: 'No authentication token provided' },
                { status: 401 }
            );
        }

        console.log("API route received token:", idToken); // Debug log

        // Send request to Flask with auth header
        const response = await fetch('http://localhost:5328/game/initialize-game', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            },
            body: JSON.stringify({ gameType, imageCount }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Flask server error:', errorData); // Debug log
            
            if (response.status === 401) {
                return NextResponse.json(
                    { error: 'Unauthorized', details: errorData },
                    { status: 401 }
                );
            }
            throw new Error('Backend error');
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error : any) {
        console.error('Game initialization error:', error);
        return NextResponse.json(
            { error: 'Failed to initialize game', details: error.message },
            { status: 500 }
        );
    }
} 