import React, { useState } from 'react';

const GameTypeModalMock = ({ isOpen, closeModal }) => {
  const [gameType, setGameType] = useState(null);
  const [boardType, setBoardType] = useState(null);
  const [imageCount, setImageCount] = useState(null);
  
  if (!isOpen) return null;
  
  const isFormValid = gameType && boardType && imageCount;
  
  const startGame = () => {
    // Mock functionality for testing
    closeModal();
  };
  
  return (
    <div className="modal">
      <h2>Select a Game Type</h2>
      
      <div className="game-types">
        <button onClick={() => setGameType('classic')}>Classic</button>
        <button onClick={() => setGameType('competition')}>Competition</button>
        <button onClick={() => setGameType('custom')}>Custom</button>
      </div>
      
      {gameType && (
        <>
          <h3>Select Game Board</h3>
          <div className="board-types">
            <button onClick={() => setBoardType('single')}>Single</button>
            <button onClick={() => setBoardType('dual')}>Dual</button>
          </div>
        </>
      )}
      
      {gameType && boardType && (
        <>
          <h3>Number of Images</h3>
          <div className="image-counts">
            <button onClick={() => setImageCount(5)}>5</button>
            <button onClick={() => setImageCount(10)}>10</button>
            <button onClick={() => setImageCount(20)}>20</button>
          </div>
        </>
      )}
      
      <button 
        disabled={!isFormValid} 
        onClick={startGame}
      >
        Start Game
      </button>
    </div>
  );
};

export default GameTypeModalMock; 