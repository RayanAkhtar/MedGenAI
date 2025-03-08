'use client'

import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'

const competitions = [
    {
        id: 2,
        name: 'Lung Warriors Only',
        game_board: 'dual',
        expiry_date: '2025-03-15',
        active: true
    },
    {
        id: 3,
        name: 'Dual CFs',
        game_board: 'dual',
        expiry_date: '2025-04-01',
        active: false
    },
    {
        id: 4,
        name: 'Bobs game',
        game_board: 'single',
        expiry_date: '2025-05-10',
        active: true
    }
]

export default function Competitions() {
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [competitions, setCompetitions] = useState([])
    const [showExpired, setShowExpired] = useState(false)

    function convertToLink(game_id, game_board) {
        if (game_board === "dual") {
            return `/game/competition/dual/${game_id}`
        } else {
            return `/game/competition/single/${game_id}`
        }

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

                // fetch all competitions
                fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getGames/${user.displayName}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {      
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    
                    return response.json();
                })
                .then(result => {
                    console.log('Response:', result);
                    setCompetitions(result)
                })
                .catch(error => {
                    console.error('Error:', error);
                });

                
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
            {/* Right side - Competitions Table with updated styling */}
            <div className="w-full p-12">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Assigned Games</h1>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-4 bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="p-6">
                        <div className="title flex flex-row items-center justify-start">
                            <h2 className="text-lg font-medium text-gray-900 flex items-center">
                                <span className="w-1.5 h-5 bg-[var(--heartflow-red)] rounded-full mr-3"></span>
                                Assigned to me
                            </h2>
                        </div>
                        <div className="flex items-center mt-2 mb-2">
                        <input 
                            type="checkbox" 
                            id="showCompleted" 
                            className="mr-2"
                            checked={showExpired} 
                            onChange={() => setShowExpired(!showExpired)} 
                        />
                            <label htmlFor="showCompleted" className="text-gray-900">Show Completed Games</label>
                        </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="text-left text-sm text-gray-500 border-b">
                                            <th className="pb-3">Game Code</th>
                                            <th className="pb-3 text-center">Type</th>
                                            <th className="pb-3 text-center">Expiry</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {competitions.filter((e,i) => {return showExpired ? true : e.active}).map((comp, index) => (
                                            <tr key={index} className="text-sm">
                                                <td className="py-3">
                                                    <a href={convertToLink(comp.id, comp.game_board)} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                                        {comp.name}
                                                    </a>
                                                </td>
                                                <td className="py-3 text-center">{comp.game_board === "dual" ? "Dual" : "Single"}</td>
                                                <td className="py-3 text-center">{comp.expiry_date}</td>
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
