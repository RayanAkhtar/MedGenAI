import firebase from "@/app/firebase/firebase";
import { createUserWithEmailAndPassword, getAuth, updateProfile } from "firebase/auth";

const auth = getAuth(firebase);

export const signup = async (email: string, password: string, fullName: string) => {
    try {
        // 1. Create Firebase user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // 2. Update the user's display name
        await updateProfile(userCredential.user, {
            displayName: fullName
        });

        // 3. Get the ID token
        const idToken = await userCredential.user.getIdToken();
        
        // 4. Register user in backend database
        const registerResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            },
            body: JSON.stringify({
                username: fullName
            })
        });

        if (!registerResponse.ok) {
            // If backend registration fails, delete the Firebase user
            await userCredential.user.delete();
            throw new Error('Failed to register user in backend');
        }

        // 5. Create session directly with Flask backend instead of going through Next.js API
        const sessionResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${idToken}`
            },
            body: JSON.stringify({ idToken })
        });

        if (!sessionResponse.ok) {
            throw new Error('Failed to create session');
        }
        
        return {
            user: userCredential.user,
            userData: await registerResponse.json()
        };
    } catch (error) {
        console.error('Signup error:', error);
        throw error;
    }
};

// Add error handling types
export type AuthError = {
    code: string;
    message: string;
};

// Add a function to handle signup errors
export const getAuthErrorMessage = (error: AuthError): string => {
    switch (error.code) {
        case 'auth/email-already-in-use':
            return 'This email is already registered.';
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/operation-not-allowed':
            return 'Email/password accounts are not enabled. Please contact support.';
        case 'auth/weak-password':
            return 'Please choose a stronger password.';
        default:
            return 'An error occurred during signup. Please try again.';
    }
};