'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'
import { login } from '@/app/firebase/login'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isValidEmail, setIsValidEmail] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()
    const { user, loading } = useAuth()
    // Email validation function
    const validateEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return regex.test(email)
    }

    // Update validation whenever email changes
    useEffect(() => {
        setIsValidEmail(validateEmail(email))
    }, [email])

    // Add this useEffect for handling redirects
    useEffect(() => {
        if (user) {
            router.push('/dashboard')
        }
    }, [user, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (isValidEmail && password) {
            setIsLoading(true)
            setError('')
            try {
                await login(email, password)
            } catch (error) {
                console.error('Login error:', error)
                setError('Invalid email or password...')
            } finally {
                setIsLoading(false)
            }
        }
    }

    // Remove the immediate redirect
    if (loading) return null;

    return (
        <div className="flex min-h-screen bg-white dark:bg-white">
            {/* Left side - Login Form */}
            <div className="w-1/2 flex flex-col items-center justify-center px-8 lg:px-16 border-r border-gray-200 bg-white dark:bg-white">
                <div className="w-full max-w-md space-y-8">
                    {/* Logo */}
                    <div className="flex justify-center mb-12">
                        <Link href="/">
                            <Image
                                src="/images/cod_logo_full.png"
                                alt="Call Of Diagnosis Logo"
                                width={350}
                                height={50}
                                priority
                            />
                        </Link>
                    </div>

                    {/* Login Form */}
                    <div className="space-y-6">
                        <h2 className="text-center text-2xl font-semibold text-gray-900 dark:text-gray-900">
                            Sign in
                        </h2>
                        
                        <p className="text-center text-sm text-gray-600 dark:text-gray-600">
                            or{' '}
                            <Link href="/signup" className="text-[var(--heartflow-blue)] hover:underline">
                                create an account
                            </Link>
                        </p>

                        {error && (
                            <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md dark:bg-red-50 dark:border-red-200">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-700">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 
                                             focus:outline-none focus:ring-[var(--heartflow-blue)] focus:border-[var(--heartflow-blue)] 
                                             bg-white dark:bg-white dark:text-gray-900 dark:border-gray-300"
                                    placeholder="Email address"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-700">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 
                                             focus:outline-none focus:ring-[var(--heartflow-blue)] focus:border-[var(--heartflow-blue)] 
                                             bg-white dark:bg-white dark:text-gray-900 dark:border-gray-300"
                                    placeholder="Enter your password"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={!isValidEmail || !password || isLoading}
                                className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white transition-all duration-200 
                                          flex items-center justify-center ${
                                    isValidEmail && password && !isLoading
                                    ? 'bg-[var(--heartflow-blue)] hover:bg-[var(--heartflow-blue)]/90 cursor-pointer dark:bg-[var(--heartflow-blue)]' 
                                    : 'bg-[#8DACC3] cursor-not-allowed dark:bg-[#8DACC3]'
                                }`}
                            >
                                {isLoading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                ) : (
                                    'Sign in'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Right side - Image */}
            <div className="hidden md:flex w-1/2 items-center justify-center p-12">
                <div className="h-full w-full relative bg-white dark:bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-200">
                    <div className="bg-white dark:bg-white">
                        <Image
                            src="/images/heartblueimage.webp"
                            alt="Login Background"
                            fill
                            className="object-cover rounded-2xl"
                            priority
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
