'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface GameImage {
    id: number
    path: string
    type: string
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
        setGameId(gameId)
        setImageCount(imageCount)
        setImages(images)
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