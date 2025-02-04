import firebase from "@/app/firebase/firebase";

import { signInWithEmailAndPassword, getAuth } from "firebase/auth";

const auth = getAuth(firebase);

export const login = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // Get the ID token
        const idToken = await userCredential.user.getIdToken();
        
        // Send ID token to your backend to create a session
        const response = await fetch('/api/auth/session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ idToken })
        });

        if (!response.ok) throw new Error('Failed to create session');
        
        return userCredential;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};