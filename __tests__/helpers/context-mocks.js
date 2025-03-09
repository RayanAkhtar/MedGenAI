import React, { createContext, useContext, useState } from 'react';

// Mock AuthContext
const mockAuthContext = createContext(null);

export const MockAuthProvider = ({ children }) => {
  const [user] = useState({
    id: 'test-user-id',
    email: 'test@example.com',
    displayName: 'Test User'
  });
  const [loading] = useState(false);
  
  return (
    <mockAuthContext.Provider value={{ user, loading }}>
      {children}
    </mockAuthContext.Provider>
  );
};

export const useMockAuth = () => useContext(mockAuthContext);

// Mock GameContext
const mockGameContext = createContext(null);

export const MockGameProvider = ({ children }) => {
  const [gameData, setGameData] = useState({
    gameId: null,
    imageCount: 0,
    images: []
  });
  
  const setGameDataFn = (gameId, imageCount, images) => {
    setGameData({
      gameId,
      imageCount,
      images
    });
  };
  
  const clearGameData = () => {
    setGameData({
      gameId: null,
      imageCount: 0,
      images: []
    });
  };
  
  return (
    <mockGameContext.Provider value={{
      gameId: gameData.gameId,
      imageCount: gameData.imageCount,
      images: gameData.images,
      setGameData: setGameDataFn,
      clearGameData
    }}>
      {children}
    </mockGameContext.Provider>
  );
};

export const useMockGame = () => useContext(mockGameContext); 