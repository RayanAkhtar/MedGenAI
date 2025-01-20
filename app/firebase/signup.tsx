import firebase from "@/app/firebase/firebase";

import { createUserWithEmailAndPassword, getAuth, updateProfile } from "firebase/auth";

const auth = getAuth(firebase);

export const signup = async (email: string, password: string, fullName: string) => {
    
    try {
        // Create user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Add full name to user profile
        await updateProfile(userCredential.user, {
            displayName: fullName
        });

        return userCredential.user;
    } catch (error) {
        throw error;
    }
}