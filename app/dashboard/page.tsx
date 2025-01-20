'use client'

import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { signout } from '@/app/firebase/signout'

export default function Dashboard() {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login')
        }
    }, [user, loading, router])



    if (loading) return null
    if (!user) return null

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Hi, {user.displayName || 'there'}! 👋
                    </h1>
                    <button
                        onClick={signout}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Sign Out
                    </button>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-gray-600">
                        Welcome to your dashboard. This is where you'll see all your important information.
                    </p>
                </div>
            </div>
        </div>
    )
}
