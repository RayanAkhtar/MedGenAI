'use client'

import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Sidebar from '@/app/components/Sidebar'
import GameTypeModal from '@/app/components/GameTypeModal'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Define interfaces for our data types
interface UserStats {
    averageAccuracy: number;
    challengesCompleted: number;
    currentRank: number;
}

interface GameActivity {
    gameType: string;
    imageCount: number;
    accuracy: number;
    date: string;
}

interface LeaderboardPlayer {
    rank: number;
    name: string;
    accuracy: number;
}

export default function Dashboard() {
    const { user, loading } = useAuth()
    const router = useRouter()
    const [isGameTypeModalOpen, setIsGameTypeModalOpen] = useState(false)
    
    // State for API data
    const [userStats, setUserStats] = useState<UserStats | null>(null)
    const [recentActivity, setRecentActivity] = useState<GameActivity[]>([])
    const [leaderboard, setLeaderboard] = useState<LeaderboardPlayer[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login')
        }
    }, [user, loading, router])

    // Fetch user stats, recent activity, and leaderboard data
    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user) return;
            
            setIsLoading(true);
            setError('');
            
            try {
                const idToken = await user.getIdToken(true);
                
                // Fetch user stats
                const statsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user_dashboard/stats`, {
                    headers: {
                        'Authorization': `Bearer ${idToken}`
                    }
                });
                
                // Fetch recent activity
                const activityResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user_dashboard/recent-activity`, {
                    headers: {
                        'Authorization': `Bearer ${idToken}`
                    }
                });
                
                // Fetch leaderboard
                const leaderboardResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user_dashboard/leaderboard`, {
                    headers: {
                        'Authorization': `Bearer ${idToken}`
                    }
                });
                
                if (!statsResponse.ok || !activityResponse.ok || !leaderboardResponse.ok) {
                    throw new Error('Failed to fetch dashboard data');
                }
                
                const statsData = await statsResponse.json();
                const activityData = await activityResponse.json();
                const leaderboardData = await leaderboardResponse.json();
                
                setUserStats(statsData);
                setRecentActivity(activityData.activities);
                setLeaderboard(leaderboardData.players);
                
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setError('Failed to load dashboard data. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };
        
        if (user) {
            fetchDashboardData();
        }
    }, [user]);

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

                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--heartflow-blue)]"></div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 p-4 rounded-lg text-red-500 mb-8">
                            {error}
                        </div>
                    ) : (
                        <>
                            {/* Stats Grid with alternating colors */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                    <h3 className="text-sm font-medium text-gray-500">Average Accuracy</h3>
                                    <p className="text-3xl font-bold text-[var(--heartflow-blue)]">
                                        {userStats?.averageAccuracy || 0}%
                                    </p>
                                </div>
                                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                    <h3 className="text-sm font-medium text-gray-500">Challenges Completed</h3>
                                    <p className="text-3xl font-bold text-[var(--heartflow-red)]">
                                        {userStats?.challengesCompleted || 0}
                                    </p>
                                </div>
                                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                    <h3 className="text-sm font-medium text-gray-500">Current Rank</h3>
                                    <p className="text-3xl font-bold text-[var(--heartflow-blue)]">
                                        #{userStats?.currentRank || 0}
                                    </p>
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
                                                    {recentActivity.length > 0 ? (
                                                        recentActivity.map((activity, index) => (
                                                            <tr key={index} className="text-sm">
                                                                <td className="py-3">{activity.gameType}</td>
                                                                <td className="py-3">{activity.imageCount}</td>
                                                                <td className="py-3 text-[var(--heartflow-blue)]">{activity.accuracy}%</td>
                                                                <td className="py-3 text-gray-500">{activity.date}</td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan={4} className="py-3 text-center text-gray-500">
                                                                No recent activity
                                                            </td>
                                                        </tr>
                                                    )}
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
                                            {leaderboard.length > 0 ? (
                                                leaderboard.map((player) => (
                                                    <div key={player.rank} className="flex items-center justify-between">
                                                        <div className="flex items-center">
                                                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm
                                                                ${player.rank === 1 ? 'bg-[var(--heartflow-red)]/10 text-[var(--heartflow-red)]' :
                                                                player.rank === 2 ? 'bg-gray-100 text-gray-700' :
                                                                player.rank === 3 ? 'bg-orange-100 text-orange-700' :
                                                                'bg-gray-50 text-gray-500'}`}>
                                                                {player.rank}
                                                            </span>
                                                            <span className="ml-3 text-sm text-gray-900">{player.name}</span>
                                                        </div>
                                                        <span className={`text-sm ${player.rank === 1 ? 'text-[var(--heartflow-red)]' : 'text-[var(--heartflow-blue)]'}`}>
                                                            {player.accuracy}%
                                                        </span>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center text-gray-500">
                                                    No leaderboard data available
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>

            <GameTypeModal 
                isOpen={isGameTypeModalOpen} 
                closeModal={() => setIsGameTypeModalOpen(false)} 
            />
        </div>
    )
}
