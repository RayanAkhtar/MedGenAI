'use client'

import Link from 'next/link'
import Image from 'next/image'
import { signout } from '@/app/firebase/signout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faHome, 
    faChartLine, 
    faTrophy,
    faHistory,
    faSignOutAlt,
    faGamepad
} from '@fortawesome/free-solid-svg-icons'

const Sidebar = () => {
    return (
        <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
            {/* Logo */}
            <div className="p-6">
                <Image
                    src="/images/heartflow-logo-blue.svg"
                    alt="HeartFlow Logo"
                    width={150}
                    height={40}
                    priority
                />
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-4">
                <div className="space-y-2">
                    <Link href="/dashboard" 
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                        <FontAwesomeIcon icon={faHome} className="w-5 h-5 mr-3" />
                        Dashboard
                    </Link>
                    
                    <Link href="/challenges" 
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                        <FontAwesomeIcon icon={faGamepad} className="w-5 h-5 mr-3" />
                        Challenges
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