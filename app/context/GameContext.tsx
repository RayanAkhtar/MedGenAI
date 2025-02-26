'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface GameImage {
    id: number
    path: string
    type: 'real' | 'ai'
}

interface GameContextType {
    gameId: string | null
    imageCount: number | null
    images: GameImage[]
    setGameData: (gameId: string, imageCount: number, images: GameImage[]) => void
    clearGameData: () => void
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: ReactNode }) {
    const [gameId, setGameId] = useState<string | null>(null)
    const [imageCount, setImageCount] = useState<number | null>(null)
    const [images, setImages] = useState<GameImage[]>([])

    const setGameData = (gameId: string, imageCount: number, images: GameImage[]) => {
        // Simple shuffle using sort with random comparison
        const shuffledImages = [...images].sort(() => Math.random() - 0.5)
        
        setGameId(gameId)
        setImageCount(imageCount)
        setImages(shuffledImages)
        
        console.log("Game data set with shuffled images")
    }

    const clearGameData = () => {
        setGameId(null)
        setImageCount(null)
        setImages([])
    }

    return (
        <GameContext.Provider value={{
            gameId,
            imageCount,
            images,
            setGameData,
            clearGameData
        }}>
            {children}
        </GameContext.Provider>
    )
}

export function useGame() {
    const context = useContext(GameContext)
    if (context === undefined) {
        throw new Error('useGame must be used within a GameProvider')
    }
    return context
} 