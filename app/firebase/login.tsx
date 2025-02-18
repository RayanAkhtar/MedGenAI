import firebase from "@/app/firebase/firebase";

import { signInWithEmailAndPassword, getAuth } from "firebase/auth";

const auth = getAuth(firebase);

export const login = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // Get the ID token
        const idToken = await userCredential.user.getIdToken();
        
        // Create session directly with Flask backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            },
            body: JSON.stringify({ idToken })
        });

        if (!response.ok) {
            throw new Error('Failed to create session');
        }
        
        return userCredential;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};