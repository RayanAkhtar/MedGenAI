'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

export default function ClassicGame() {
    const searchParams = useSearchParams();
    const gameId = searchParams.get('gameId');
    const imageCount = searchParams.get('count');
    
    const [score, setScore] = useState(0);
    const [showRules, setShowRules] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    // For now, just use placeholder images
    const images = Array(Number(imageCount)).fill(null).map((_, i) => ({
        id: i + 1,
        path: '/images/placeholder.jpg',  // Make sure this exists in your public folder
        type: 'classic'
    }));

    const handleGuess = (selectedId: number) => {
        setCurrentIndex(prev => prev + 1);
    };

    // Show current image pair or game completion
    const currentPair = images.slice(currentIndex * 2, (currentIndex * 2) + 2);
    const isGameComplete = currentIndex * 2 >= images.length;

    if (isGameComplete) {
        return <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Game Complete!</h2>
                <p className="text-xl">Final Score: {score}</p>
            </div>
        </div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            {/* Rules Modal */}
            {showRules && (
                <div 
                    className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                    onClick={() => setShowRules(false)}
                >
                    <div 
                        className="bg-white rounded-lg p-6 max-w-md"
                        onClick={e => e.stopPropagation()}
                    >
                        <h2 className="text-2xl font-bold mb-4">Game #{gameId}</h2>
                        <p className="mb-4">Images to analyze: {imageCount}</p>
                        <button 
                            onClick={() => setShowRules(false)}
                            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                        >
                            Start Playing
                        </button>
                    </div>
                </div>
            )}

            {/* Main Game UI */}
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-4">Real or AI?</h1>
                    <div className="flex justify-center gap-4">
                        <p className="text-xl">Score: {score}</p>
                        <p className="text-xl">Image: {currentIndex + 1}/{images.length/2}</p>
                    </div>
                </div>

                {/* Image Grid */}
                <div className="grid grid-cols-2 gap-8">
                    {currentPair.map((image) => (
                        <div 
                            key={image.id}
                            onClick={() => handleGuess(image.id)}
                            className="relative aspect-square cursor-pointer hover:opacity-90 
                                     transition-opacity rounded-lg overflow-hidden"
                        >
                            <Image
                                src={image.path}
                                alt={`Image ${image.id}`}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
