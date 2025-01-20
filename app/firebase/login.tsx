import firebase from "@/app/firebase/firebase";

import { signInWithEmailAndPassword, getAuth } from "firebase/auth";

const auth = getAuth(firebase);

export const login = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error(error);
        throw error;
    }
}