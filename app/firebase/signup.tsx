import firebase from "@/app/firebase/firebase";

import { createUserWithEmailAndPassword, getAuth, updateProfile } from "firebase/auth";

const auth = getAuth(firebase);

export const signup = async (email: string, password: string, fullName: string) => {
    
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Update the user's display name
        await updateProfile(userCredential.user, {
            displayName: fullName
        });

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
        console.error('Signup error:', error);
        throw error;
    }
};