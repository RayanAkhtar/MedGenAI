'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { User } from 'firebase/auth'
import app from '@/app/firebase/firebase'
import { getAuth } from 'firebase/auth'

// null : user has logged out or not logged in yet
// User : user has logged in

const auth = getAuth(app)
export const AuthContext = createContext<{ user: User | null, loading: boolean }>({ 
    user: null,
    loading: true 
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
            setUser(firebaseUser)
            setLoading(false)
        });
        return unsubscribe;
    }, [])

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {loading ? (
                <div className="flex justify-center items-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)
}