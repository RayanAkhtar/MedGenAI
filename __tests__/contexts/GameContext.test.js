import { render, screen, fireEvent } from '@testing-library/react';
import { MockGameProvider, useMockGame } from '../helpers/context-mocks';

// Test component that uses the mock GameContext
const TestComponent = () => {
  const { gameId, imageCount, images, setGameData, clearGameData } = useMockGame();
  
  return (
    <div>
      <div data-testid="gameId">{gameId || 'No Game ID'}</div>
      <div data-testid="imageCount">{imageCount || 0}</div>
      <div data-testid="imagesLength">{images?.length || 0}</div>
      <button 
        data-testid="setGame" 
        onClick={() => setGameData('test-game', 5, [
          { id: 1, path: '/test1.jpg', type: 'real' },
          { id: 2, path: '/test2.jpg', type: 'ai' }
        ])}
      >
        Set Game
      </button>
      <button data-testid="clearGame" onClick={clearGameData}>Clear Game</button>
    </div>
  );
};

describe('GameContext', () => {
  it('should initialize with empty game data', () => {
    render(
      <MockGameProvider>
        <TestComponent />
      </MockGameProvider>
    );
    
    expect(screen.getByTestId('gameId')).toHaveTextContent('No Game ID');
    expect(screen.getByTestId('imageCount')).toHaveTextContent('0');
    expect(screen.getByTestId('imagesLength')).toHaveTextContent('0');
  });
  
  it('should set game data correctly', () => {
    render(
      <MockGameProvider>
        <TestComponent />
      </MockGameProvider>
    );
    
    fireEvent.click(screen.getByTestId('setGame'));
    
    expect(screen.getByTestId('gameId')).toHaveTextContent('test-game');
    expect(screen.getByTestId('imageCount')).toHaveTextContent('5');
    expect(screen.getByTestId('imagesLength')).toHaveTextContent('2');
  });
  
  it('should clear game data correctly', () => {
    render(
      <MockGameProvider>
        <TestComponent />
      </MockGameProvider>
    );
    
    // First set data
    fireEvent.click(screen.getByTestId('setGame'));
    // Then clear it
    fireEvent.click(screen.getByTestId('clearGame'));
    
    expect(screen.getByTestId('gameId')).toHaveTextContent('No Game ID');
    expect(screen.getByTestId('imageCount')).toHaveTextContent('0');
    expect(screen.getByTestId('imagesLength')).toHaveTextContent('0');
  });
}); 