'use client'

import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Sidebar from '@/app/components/Sidebar'
import GameTypeModal from '@/app/components/GameTypeModal'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Dashboard() {
    const { user, loading } = useAuth()
    const router = useRouter()
    const [isGameTypeModalOpen, setIsGameTypeModalOpen] = useState(false)

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login')
        }
    }, [user, loading, router])

    if (loading) return null
    if (!user) return null

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            
            <main className="flex-1 overflow-y-auto p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header with red accent */}
                    <div className="mb-8 border-l-4 border-[var(--heartflow-red)] pl-4">
                        <h1 className="text-2xl font-bold text-gray-900">
                            Welcome back, {user.displayName}!
                        </h1>
                    </div>

                    {/* Stats Grid with alternating colors */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h3 className="text-sm font-medium text-gray-500">Average Accuracy</h3>
                            <p className="text-3xl font-bold text-[var(--heartflow-blue)]">85%</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h3 className="text-sm font-medium text-gray-500">Challenges Completed</h3>
                            <p className="text-3xl font-bold text-[var(--heartflow-red)]">24</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h3 className="text-sm font-medium text-gray-500">Current Rank</h3>
                            <p className="text-3xl font-bold text-[var(--heartflow-blue)]">#12</p>
                        </div>
                    </div>

                    {/* Two-tone button */}
                    <div className="mb-8 flex gap-4">
                        <button
                            onClick={() => setIsGameTypeModalOpen(true)}
                            className="px-8 py-4 bg-[var(--heartflow-blue)] text-white rounded-xl hover:bg-[var(--heartflow-blue)]/90 transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center gap-2 text-lg font-medium"
                        >
                            <FontAwesomeIcon icon={faPlay} className="w-5 h-5" />
                            Start New Game
                        </button>
                        <button
                            onClick={() => setIsGameTypeModalOpen(true)}
                            className="px-8 py-4 bg-[var(--heartflow-red)] text-white rounded-xl hover:bg-[var(--heartflow-red)]/90 transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center gap-2 text-lg font-medium"
                        >
                            Quick Play
                        </button>
                    </div>

                    {/* Recent Activity and Leaderboard with red accents */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="p-6">
                                <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                    <span className="w-1.5 h-5 bg-[var(--heartflow-red)] rounded-full mr-3"></span>
                                    Recent Activity
                                </h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="text-left text-sm text-gray-500 border-b">
                                                <th className="pb-3">Game Type</th>
                                                <th className="pb-3">Images</th>
                                                <th className="pb-3">Accuracy</th>
                                                <th className="pb-3">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            <tr className="text-sm">
                                                <td className="py-3">Classic</td>
                                                <td className="py-3">15</td>
                                                <td className="py-3 text-[var(--heartflow-blue)]">92%</td>
                                                <td className="py-3 text-gray-500">Today</td>
                                            </tr>
                                            <tr className="text-sm">
                                                <td className="py-3">Competitive</td>
                                                <td className="py-3">25</td>
                                                <td className="py-3 text-[var(--heartflow-blue)]">88%</td>
                                                <td className="py-3 text-gray-500">Yesterday</td>
                                            </tr>
                                            <tr className="text-sm">
                                                <td className="py-3">Special</td>
                                                <td className="py-3">10</td>
                                                <td className="py-3 text-[var(--heartflow-blue)]">95%</td>
                                                <td className="py-3 text-gray-500">2 days ago</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                            <div className="p-6">
                                <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                    <span className="w-1.5 h-5 bg-[var(--heartflow-red)] rounded-full mr-3"></span>
                                    Top Players
                                </h2>
                                <div className="space-y-4">
                                    {[1, 2, 3, 4, 5].map((rank) => (
                                        <div key={rank} className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm
                                                    ${rank === 1 ? 'bg-[var(--heartflow-red)]/10 text-[var(--heartflow-red)]' :
                                                    rank === 2 ? 'bg-gray-100 text-gray-700' :
                                                    rank === 3 ? 'bg-orange-100 text-orange-700' :
                                                    'bg-gray-50 text-gray-500'}`}>
                                                    {rank}
                                                </span>
                                                <span className="ml-3 text-sm text-gray-900">Player {rank}</span>
                                            </div>
                                            <span className={`text-sm ${rank === 1 ? 'text-[var(--heartflow-red)]' : 'text-[var(--heartflow-blue)]'}`}>
                                                {95 - (rank * 2)}%
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <GameTypeModal 
                isOpen={isGameTypeModalOpen} 
                closeModal={() => setIsGameTypeModalOpen(false)} 
            />
        </div>
    )
}
