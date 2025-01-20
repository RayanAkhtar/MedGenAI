import { getAuth, signOut } from 'firebase/auth'
import app from '@/app/firebase/firebase'

const auth = getAuth(app)

export const signout = async () => {
    try {
        await signOut(auth)
    } catch (error) {
        throw error
    }
}