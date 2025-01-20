'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isValidEmail, setIsValidEmail] = useState(false)

    // Email validation function
    const validateEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return regex.test(email)
    }

    // Update validation whenever email changes
    useEffect(() => {
        setIsValidEmail(validateEmail(email))
    }, [email])

    return (
        <div className="flex min-h-screen">
            {/* Left side - Login Form */}
            <div className="w-1/2 flex flex-col items-center justify-center px-8 lg:px-16 border-r border-gray-200">
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

                    {/* Login Form */}
                    <div className="mt-10 space-y-6">
                        <h2 className="text-center text-2xl font-semibold text-gray-900">
                            Sign in
                        </h2>
                        
                        <p className="text-center text-sm text-gray-600">
                            or{' '}
                            <Link href="/signup" className="text-[var(--heartflow-blue)] hover:underline">
                                create an account
                            </Link>
                        </p>

                        <form className="mt-8 space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[var(--heartflow-blue)] focus:border-[var(--heartflow-blue)]"
                                    placeholder="Email address"
                                />
                            </div>

                            <div>
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

                            <button
                                type="submit"
                                disabled={!isValidEmail || !password}
                                className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white transition-all duration-200 ${
                                    isValidEmail && password
                                    ? 'bg-[var(--heartflow-blue)] hover:bg-[var(--heartflow-blue)]/90 cursor-pointer' 
                                    : 'bg-[#8DACC3] cursor-not-allowed'
                                }`}
                            >
                                Sign in
                            </button>

                        </form>
                    </div>
                </div>
            </div>

            {/* Right side - Image with padding and rounded corners */}
            <div className="hidden md:block w-1/2 bg-white p-12">
                <div className="h-full w-full relative bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-200">
                    <div className="">
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