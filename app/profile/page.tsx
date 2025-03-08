'use client'

import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Sidebar from '@/app/components/Sidebar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faGamepad, 
    faBullseye,
    faChartLine
} from '@fortawesome/free-solid-svg-icons'
import { Line } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

export type GameType = 'all' | 'single' | 'dual';

export interface ProfileData {
    gamesPlayed: number;
    accuracy: number;
    rank: number;
    points: number;
}

export interface GameHistory {
    id: number;
    type: string;
    accuracy: number;
    date: string;
    images: number;
}

interface PerformanceData {
    labels: string[];
    data: number[];
}

export interface GamePerformance {
    all: PerformanceData;
    single: PerformanceData;
    dual: PerformanceData;
}

export default function Profile() {
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()
    const [selectedGameType, setSelectedGameType] = useState<GameType>('all')
    const [profileData, setProfileData] = useState<ProfileData | null>(null)
    const [recentGames, setRecentGames] = useState<GameHistory[]>([])
    const [performanceData, setPerformanceData] = useState<GamePerformance | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login')
        }
    }, [user, authLoading, router])

    useEffect(() => {
        const fetchProfileData = async () => {
            if (!user) return;
            
            try {
                setIsLoading(true);
                const idToken = await user.getIdToken(true);
                
                // Fetch profile data
                const profileResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/profile/data`, {
                    headers: {
                        'Authorization': `Bearer ${idToken}`
                    }
                });

                // Fetch recent games
                const historyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/profile/game-history`, {
                    headers: {
                        'Authorization': `Bearer ${idToken}`
                    }
                });

                // Fetch performance data
                const performanceResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/profile/performance`, {
                    headers: {
                        'Authorization': `Bearer ${idToken}`
                    }
                });

                if (!profileResponse.ok || !historyResponse.ok || !performanceResponse.ok) {
                    throw new Error('Failed to fetch profile data');
                }

                const profileData = await profileResponse.json();
                const historyData = await historyResponse.json();
                const performanceData = await performanceResponse.json();

                setProfileData(profileData);
                setRecentGames(historyData.games || []);
                setPerformanceData(performanceData);
                
                console.log('Profile Data:', profileData);
                console.log('History Data:', historyData);
                console.log('Performance Data:', performanceData);
                
            } catch (error) {
                console.error('Error fetching profile data:', error);
                setRecentGames([]);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            fetchProfileData();
        }
    }, [user]);

    if (authLoading || isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--heartflow-red)]"></div>
            </div>
        );
    }

    if (!user) return null;

    if (!profileData || !performanceData) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-red-500">Failed to load profile data</div>
            </div>
        );
    }

    const chartData = {
        labels: performanceData[selectedGameType].labels,
        datasets: [{
            label: 'Accuracy %',
            data: performanceData[selectedGameType].data,
            borderColor: 'rgb(var(--heartflow-red))',
            backgroundColor: 'rgba(var(--heartflow-red), 0.1)',
            tension: 0.4,
            fill: true
        }]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: false
            }
        },
        scales: {
            y: {
                type: 'linear' as const,
                beginAtZero: false,
                min: 0,
                max: 100,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                },
                ticks: {
                    callback: function(tickValue: number | string) {
                        return `${tickValue}%`
                    }
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            
            <main className="flex-1 overflow-y-auto p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Profile Header */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-20 h-20 rounded-full bg-[var(--heartflow-red)] flex items-center justify-center text-white text-3xl">
                                {user.displayName?.charAt(0) || 'U'}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{user.displayName}</h1>
                                <p className="text-gray-500">{user.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Stats */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <FontAwesomeIcon icon={faGamepad} className="w-5 h-5 text-[var(--heartflow-red)] mr-3" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Games Played</p>
                                            <p className="text-2xl font-bold text-gray-900">{profileData.gamesPlayed}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <FontAwesomeIcon icon={faBullseye} className="w-5 h-5 text-[var(--heartflow-red)] mr-3" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Average Accuracy</p>
                                            <p className="text-2xl font-bold text-gray-900">{profileData.accuracy}%</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Performance Graph and Recent Games */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Performance Graph */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-medium text-gray-900 flex items-center">
                                        <FontAwesomeIcon icon={faChartLine} className="w-5 h-5 text-[var(--heartflow-red)] mr-2" />
                                        Accuracy Trends
                                    </h2>
                                    <div className="flex gap-2">
                                        {['all', 'single', 'dual'].map((type) => (
                                            <button
                                                key={type}
                                                onClick={() => setSelectedGameType(type as GameType)}
                                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                                                    ${selectedGameType === type 
                                                        ? 'bg-[var(--heartflow-red)] text-white' 
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                            >
                                                {type.charAt(0).toUpperCase() + type.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="h-[300px]">
                                    <Line data={chartData} options={chartOptions} />
                                </div>
                            </div>

                            {/* Recent Games */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                    <FontAwesomeIcon icon={faChartLine} className="w-5 h-5 text-[var(--heartflow-red)] mr-2" />
                                    Recent Games
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
                                            {Array.isArray(recentGames) && recentGames.length > 0 ? (
                                                recentGames.map(game => (
                                                    <tr key={game.id} className="text-sm">
                                                        <td className="py-3">{game.type}</td>
                                                        <td className="py-3">{game.images}</td>
                                                        <td className="py-3 text-[var(--heartflow-red)]">{game.accuracy}%</td>
                                                        <td className="py-3 text-gray-500">{game.date}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={4} className="py-3 text-center text-gray-500">
                                                        No recent games found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
