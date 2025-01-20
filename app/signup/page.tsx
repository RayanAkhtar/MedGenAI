'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Signup() {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isValidEmail, setIsValidEmail] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    // Email validation function
    const validateEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return regex.test(email)
    }

    // Handle continue button click
    const handleContinue = (e: React.FormEvent) => {
        e.preventDefault()
        if (isValidEmail) {
            setShowPassword(true)
        }
    }

    // Handle final form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (isValidEmail && password) {
            // Handle signup logic here
            console.log('Signing up with:', { firstName, lastName, email, password })
        }
    }

    // Update validation whenever email changes
    useEffect(() => {
        setIsValidEmail(validateEmail(email))
    }, [email])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                {/* Logo */}
                <div className="flex justify-center">
                    <Image
                        src="/images/heartflow-logo-blue.svg"
                        alt="HeartFlow Logo"
                        width={200}
                        height={50}
                        priority
                    />
                </div>

                {/* Signup Form */}
                <div className="mt-10 space-y-6">
                    <h2 className="text-center text-2xl font-semibold text-gray-900">
                        Signup to join Medical GenAI
                    </h2>

                    <form onSubmit={showPassword ? handleSubmit : handleContinue} className="mt-8 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                                    First Name
                                </label>
                                <input
                                    id="firstName"
                                    name="firstName"
                                    type="text"
                                    required
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[var(--heartflow-blue)] focus:border-[var(--heartflow-blue)]"
                                    placeholder="John"
                                    disabled={showPassword}
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                                    Last Name
                                </label>
                                <input
                                    id="lastName"
                                    name="lastName"
                                    type="text"
                                    required
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[var(--heartflow-blue)] focus:border-[var(--heartflow-blue)]"
                                    placeholder="Doe"
                                    disabled={showPassword}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Work email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[var(--heartflow-blue)] focus:border-[var(--heartflow-blue)]"
                                placeholder="name@company.com"
                                disabled={showPassword}
                            />
                        </div>

                        {showPassword && (
                            <div className="space-y-1">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[var(--heartflow-blue)] focus:border-[var(--heartflow-blue)]"
                                    placeholder="Enter your password"
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={!isValidEmail || (showPassword && !password) || !firstName || !lastName}
                            className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white transition-all duration-200 ${
                                (isValidEmail && (!showPassword || password) && firstName && lastName)
                                ? 'bg-[var(--heartflow-blue)] hover:bg-[var(--heartflow-blue)]/90 cursor-pointer' 
                                : 'bg-[#8DACC3] cursor-not-allowed'
                            }`}
                        >
                            {showPassword ? 'Sign up' : 'Continue'}
                        </button>

                    </form>

                    <p className="text-xs text-center text-gray-600 mt-8">
                        By creating an account, you agree to the{' '}
                        <Link href="/terms" className="text-[var(--heartflow-blue)] hover:underline">
                            Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy" className="text-[var(--heartflow-blue)] hover:underline">
                            Privacy Policy
                        </Link>
                    </p>

                    <p className="text-sm text-center text-gray-600">
                        Already have an account?{' '}
                        <Link href="/login" className="text-[var(--heartflow-blue)] hover:underline font-medium">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}