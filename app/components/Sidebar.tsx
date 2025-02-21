'use client'

import Link from 'next/link'
import Image from 'next/image'
import { signout } from '@/app/firebase/signout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useAuth } from '@/app/context/AuthContext'
import { 
    faHome, 
    faTrophy,
    faHistory,
    faSignOutAlt,
    faGamepad,
    faUser
} from '@fortawesome/free-solid-svg-icons'

const Sidebar = () => {
    const { user } = useAuth()

    return (
        <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
            {/* Logo */}
            <div className="p-6">
                <Image
                    src="/images/cod_logo_full.png"
                    alt="HeartFlow Logo"
                    width={300}
                    height={40}
                    priority
                />
            </div>

            {/* User Profile Section */}
            <Link href="/profile" className="block">
                <div className="px-6 py-4 border-b border-gray-200 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--heartflow-blue)] flex items-center justify-center text-white">
                            {user?.displayName?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {user?.displayName || 'User'}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {user?.email || ''}
                            </p>
                        </div>
                    </div>
                </div>
            </Link>

            {/* Navigation Links */}
            <nav className="flex-1 px-4 mt-4">
                <div className="space-y-2">
                    <Link href="/dashboard" 
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                        <FontAwesomeIcon icon={faHome} className="w-5 h-5 mr-3" />
                        Dashboard
                    </Link>
                    
                    <Link href="/competitions" 
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                        <FontAwesomeIcon icon={faGamepad} className="w-5 h-5 mr-3" />
                        Competitions
                    </Link>

                    <Link href="/leaderboard" 
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                        <FontAwesomeIcon icon={faTrophy} className="w-5 h-5 mr-3" />
                        Leaderboard
                    </Link>

                    <Link href="/history" 
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                        <FontAwesomeIcon icon={faHistory} className="w-5 h-5 mr-3" />
                        History
                    </Link>

                    <Link href="/profile" 
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                        <FontAwesomeIcon icon={faUser} className="w-5 h-5 mr-3" />
                        Profile
                    </Link>
                </div>
            </nav>

            {/* Sign Out Button */}
            <div className="p-4 border-t border-gray-200">
                <button
                    onClick={signout}
                    className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                    <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5 mr-3" />
                    Sign Out
                </button>
            </div>
        </div>
    )
}

export default Sidebar 