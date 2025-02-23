'use client'

import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Sidebar from '@/app/components/Sidebar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faMedal, 
    faFire, 
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

// Add this type near the top of the file
type GameType = 'all' | 'classic' | 'competitive' | 'special';

export default function Profile() {
    const { user, loading } = useAuth()
    const router = useRouter()
    const [selectedGameType, setSelectedGameType] = useState<GameType>('all')

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login')
        }
    }, [user, loading, router])

    if (loading) return null
    if (!user) return null

    // Mock data - replace with real data from your backend
    const stats = {
        gamesPlayed: 156,
        accuracy: 87,
        streak: 12,
        rank: 34,
        points: 2850,
        badges: 8
    }

    const recentGames = [
        { id: 1, type: 'Classic', score: 92, date: '2024-02-20', images: 15 },
        { id: 2, type: 'Competitive', score: 88, date: '2024-02-19', images: 25 },
        { id: 3, type: 'Special', score: 95, date: '2024-02-18', images: 10 },
    ]
    const badges = [
        { id: 1, name: 'Lung Puncturer', icon: '🫁', description: 'Achieved 95% accuracy detecting synthetic pulmonary patterns', date: '2024-01-20' },
        { id: 2, name: 'Cardio Cooker', icon: '⚡', description: 'Distinguished real vs AI heart scans for 10 days straight', date: '2024-02-01' },
        { id: 3, name: 'AI Demolisher', icon: '🧠', description: 'Insane at spotting Neural Network generated images', date: '2024-02-05' },
        { id: 4, name: 'Suspecting Synthesiser', icon: '🔍', description: 'Expert at identifying AI points within synthetic medical scans', date: '2024-02-10' }
    ]

    // Mock data for different game types
    const gamePerformanceData = {
        all: {
            labels: ['Jan 15', 'Jan 20', 'Jan 25', 'Jan 30', 'Feb 5', 'Feb 10', 'Feb 15', 'Feb 20'],
            data: [75, 82, 80, 85, 88, 86, 90, 87]
        },
        classic: {
            labels: ['Jan 18', 'Jan 22', 'Jan 28', 'Feb 2', 'Feb 8', 'Feb 15', 'Feb 18', 'Feb 20'],
            data: [78, 85, 83, 88, 90, 87, 92, 89]
        },
        competitive: {
            labels: ['Jan 15', 'Jan 21', 'Jan 26', 'Feb 1', 'Feb 6', 'Feb 12', 'Feb 16', 'Feb 19'],
            data: [72, 79, 77, 82, 85, 84, 88, 85]
        },
        special: {
            labels: ['Jan 20', 'Jan 25', 'Jan 30', 'Feb 4', 'Feb 9', 'Feb 14', 'Feb 17', 'Feb 20'],
            data: [80, 85, 82, 87, 89, 88, 91, 90]
        }
    }

    const chartData = {
        labels: gamePerformanceData[selectedGameType].labels,
        datasets: [
            {
                label: 'Accuracy %',
                data: gamePerformanceData[selectedGameType].data,
                borderColor: 'rgb(var(--heartflow-red))',
                backgroundColor: 'rgba(var(--heartflow-red), 0.1)',
                tension: 0.4,
                fill: true
            }
        ]
    }

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
                min: 60,
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
                    {/* Profile Header - Full Width */}
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
                        {/* Left Column - Stats and Badges */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Stats Grid */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <FontAwesomeIcon icon={faGamepad} className="w-5 h-5 text-[var(--heartflow-red)] mr-3" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Games Played</p>
                                            <p className="text-2xl font-bold text-gray-900">{stats.gamesPlayed}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <FontAwesomeIcon icon={faBullseye} className="w-5 h-5 text-[var(--heartflow-red)] mr-3" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Average Accuracy</p>
                                            <p className="text-2xl font-bold text-gray-900">{stats.accuracy}%</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <FontAwesomeIcon icon={faFire} className="w-5 h-5 text-[var(--heartflow-red)] mr-3" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-500">Current Streak</p>
                                            <p className="text-2xl font-bold text-gray-900">{stats.streak} days</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Badges Section */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                    <FontAwesomeIcon icon={faMedal} className="w-5 h-5 text-[var(--heartflow-red)] mr-2" />
                                    Badges
                                </h2>
                                <div className="space-y-4">
                                    {badges.map(badge => (
                                        <div key={badge.id} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex items-center space-x-3">
                                                <span className="text-2xl bg-[var(--heartflow-red)]/10 w-12 h-12 flex items-center justify-center rounded-full">
                                                    {badge.icon}
                                                </span>
                                                <div>
                                                    <h3 className="font-medium text-gray-900">{badge.name}</h3>
                                                    <p className="text-sm text-gray-500">{badge.description}</p>
                                                    <p className="text-xs text-[var(--heartflow-red)] mt-1">Earned {badge.date}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Graphs and Recent Games */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Performance Graph */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-medium text-gray-900 flex items-center">
                                        <FontAwesomeIcon icon={faChartLine} className="w-5 h-5 text-[var(--heartflow-red)] mr-2" />
                                        Accuracy Trends
                                    </h2>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setSelectedGameType('all')}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                                                ${selectedGameType === 'all' 
                                                    ? 'bg-[var(--heartflow-red)] text-white' 
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                        >
                                            All Games
                                        </button>
                                        <button
                                            onClick={() => setSelectedGameType('classic')}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                                                ${selectedGameType === 'classic' 
                                                    ? 'bg-[var(--heartflow-red)] text-white' 
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                        >
                                            Classic
                                        </button>
                                        <button
                                            onClick={() => setSelectedGameType('competitive')}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                                                ${selectedGameType === 'competitive' 
                                                    ? 'bg-[var(--heartflow-red)] text-white' 
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                        >
                                            Competitive
                                        </button>
                                        <button
                                            onClick={() => setSelectedGameType('special')}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                                                ${selectedGameType === 'special' 
                                                    ? 'bg-[var(--heartflow-red)] text-white' 
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                        >
                                            Special
                                        </button>
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
                                                <th className="pb-3">Score</th>
                                                <th className="pb-3">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {recentGames.map(game => (
                                                <tr key={game.id} className="text-sm">
                                                    <td className="py-3">{game.type}</td>
                                                    <td className="py-3">{game.images}</td>
                                                    <td className="py-3 text-[var(--heartflow-red)]">{game.score}%</td>
                                                    <td className="py-3 text-gray-500">{game.date}</td>
                                                </tr>
                                            ))}
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
