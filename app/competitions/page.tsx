'use client'

import { useRouter } from 'next/router'
import Sidebar from '../components/Sidebar'
import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react'

const competitions = [
    {
        name: 'Hello',
        type: 'Dual',
        link: '/game/dual/AL19JQ82TR',
        totalPlayers: 0,
        start: '2025-02-21',
        deadline: '2025-02-28',
        topPlayer: 'N/A',
        topScore: 0
    },
    {
        name: 'Global Coding Challenge',
        type: 'Dual',
        link: 'https://example.com/global-coding-challenge',
        totalPlayers: 1500,
        start: '2025-03-12',
        deadline: '2025-03-15',
        topPlayer: 'Alice Johnson',
        topScore: 9800
    },
    {
        name: 'AI Innovation Cup',
        type: 'Dual',
        link: 'https://example.com/ai-innovation-cup',
        totalPlayers: 980,
        start: '2025-03-15',
        deadline: '2025-04-01',
        topPlayer: 'Bob Smith',
        topScore: 11200
    },
    {
        name: 'Data Science Derby',
        type: 'Dual',
        link: 'https://example.com/data-science-derby',
        totalPlayers: 720,
        start: '2025-05-03',
        deadline: '2025-05-10',
        topPlayer: 'Charlie Lee',
        topScore: 8700
    }
]

export default function Competitions() {


    return (
        <div className="flex min-h-screen bg-white">
            <Sidebar />
            {/* Right side - Competitions Table with updated styling */}
            <div className="w-full p-12">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Competitions</h1>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-6">
                            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                                <span className="w-1.5 h-5 bg-[var(--heartflow-red)] rounded-full mr-3"></span>
                                Active Competitions
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left text-sm text-gray-500 border-b">
                                            <th className="pb-3">Competition Name</th>
                                            <th className="pb-3 text-center">Type</th>
                                            <th className="pb-3 text-center">Total Players</th>
                                            <th className="pb-3 text-center">Start</th>
                                            <th className="pb-3 text-center">Deadline</th>
                                            <th className="pb-3 text-center">Top Player</th>
                                            <th className="pb-3 text-center">Top Score</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {competitions.map((comp, index) => (
                                            <tr key={index} className="text-sm">
                                                <td className="py-3">
                                                    <a href={comp.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                                        {comp.name}
                                                    </a>
                                                </td>
                                                <td className="py-3 text-center">{comp.type}</td>
                                                <td className="py-3 text-center">{comp.totalPlayers}</td>
                                                <td className="py-3 text-center">{comp.start}</td>
                                                <td className="py-3 text-center">{comp.deadline}</td>
                                                <td className="py-3 text-center">{comp.topPlayer}</td>
                                                <td className="py-3 text-center">{comp.topScore}</td>
                                            </tr>
                                        ))}
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
        </div>
    )
}
