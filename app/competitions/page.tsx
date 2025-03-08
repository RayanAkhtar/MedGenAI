'use client'

import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'

interface Competition {
    id: number;
    name: string;
    game_board: 'dual' | 'single';
    start_date: string;
    end_date: string;
}

export default function Competitions() {
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [competitions, setCompetitions] = useState<Competition[]>([])

    function convertToLink(game_id: number, game_board: 'dual' | 'single'): string {
        return game_board === 'dual' 
            ? `/game/competition/dual/${game_id}` 
            : `/game/competition/single/${game_id}`
    }

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login')
        }
    }, [user, authLoading, router])

    useEffect(() => {
        const fetchCompetitions = async () => {
            if (!user) return;
            
            try {
                setIsLoading(true);

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/competitions/all`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result: Competition[] = await response.json();
                console.log('Response:', result);
                setCompetitions(result);
            } catch (error) {
                console.error('Error fetching competitions data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            fetchCompetitions();
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

    return (
        <div className="flex min-h-screen bg-white">
            <Sidebar />
            <div className="w-full p-12">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Competitions</h1>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-4 bg-white rounded-lg shadow-sm border border-gray-200">
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
                                            <th className="pb-3 text-center">Start</th>
                                            <th className="pb-3 text-center">Deadline</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {competitions.map((comp) => (
                                            <tr key={comp.id} className="text-sm">
                                                <td className="py-3">
                                                    <a href={convertToLink(comp.id, comp.game_board)} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                                        {comp.name}
                                                    </a>
                                                </td>
                                                <td className="py-3 text-center">{comp.game_board === 'dual' ? 'Dual' : 'Single'}</td>
                                                <td className="py-3 text-center">{comp.start_date}</td>
                                                <td className="py-3 text-center">{comp.end_date}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}