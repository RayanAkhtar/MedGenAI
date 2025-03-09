'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/app/context/AdminAuthContext';
import Image from 'next/image';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { adminLogin } = useAdminAuth();
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const success = adminLogin(username, password);
    if (success) {
      router.push('/admin');
    } else {
      setError('Invalid admin credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-[var(--heartflow-blue)] py-4">
          <div className="text-center">
            <Image
              src="/images/cod_logo_full.png"
              alt="Admin Logo"
              width={250}
              height={40}
              className="mx-auto"
            />
          </div>
        </div>
        
        <div className="p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
            Admin Login
          </h2>
          
          {error && (
            <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full py-2 px-4 bg-[var(--heartflow-red)] text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 