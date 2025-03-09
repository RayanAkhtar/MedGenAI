import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GameTypeModal from '@/app/components/GameTypeModal';
import { useRouter } from 'next/navigation';
import { auth } from '@/app/firebase/firebase';
import { useGame } from '@/app/context/GameContext';
import GameTypeModalMock from '../mocks/GameTypeModalMock';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the auth
jest.mock('@/app/firebase/firebase', () => ({
  auth: {
    currentUser: {
      getIdToken: jest.fn().mockResolvedValue('mock-token'),
    }
  }
}));

// Mock the useGame hook
jest.mock('@/app/context/GameContext', () => ({
  useGame: jest.fn(),
}));

describe('GameTypeModal', () => {
  const mockCloseModal = jest.fn();
  const mockRouter = { push: jest.fn() };
  const mockSetGameData = jest.fn();
  
  beforeEach(() => {
    useRouter.mockReturnValue(mockRouter);
    useGame.mockReturnValue({ setGameData: mockSetGameData });
    
    global.fetch.mockReset();
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ 
        gameId: 'test-game-123',
        images: [
          { url: '/test1.jpg', type: 'real' },
          { url: '/test2.jpg', type: 'ai' },
        ]
      }),
    });
  });
  
  it('renders correctly when open', () => {
    render(<GameTypeModalMock isOpen={true} closeModal={mockCloseModal} />);
    
    expect(screen.getByText(/Select a Game Type/i)).toBeInTheDocument();
    expect(screen.getByText(/Classic/i)).toBeInTheDocument();
    expect(screen.getByText(/Competition/i)).toBeInTheDocument();
    expect(screen.getByText(/Custom/i)).toBeInTheDocument();
  });
  
  it('does not render when closed', () => {
    render(<GameTypeModal isOpen={false} closeModal={mockCloseModal} />);
    
    expect(screen.queryByText(/Select a Game Type/i)).not.toBeInTheDocument();
  });
  
  it('selects game type and shows options', () => {
    render(<GameTypeModal isOpen={true} closeModal={mockCloseModal} />);
    
    // Click on Classic mode
    fireEvent.click(screen.getByText(/Classic/i));
    
    // Should show board selection
    expect(screen.getByText(/Select Game Board/i)).toBeInTheDocument();
    expect(screen.getByText(/Single/i)).toBeInTheDocument();
    expect(screen.getByText(/Dual/i)).toBeInTheDocument();
  });
  
  it('enables Start Game button when all selections are made', () => {
    render(<GameTypeModal isOpen={true} closeModal={mockCloseModal} />);
    
    // Button should initially be disabled
    expect(screen.getByRole('button', { name: /Start Game/i })).toBeDisabled();
    
    // Make selections
    fireEvent.click(screen.getByText(/Classic/i));
    fireEvent.click(screen.getByText(/Single/i));
    
    // Number of images should appear
    expect(screen.getByText(/Number of Images/i)).toBeInTheDocument();
    
    // Select 10 images
    fireEvent.click(screen.getByText('10'));
    
    // Button should now be enabled
    expect(screen.getByRole('button', { name: /Start Game/i })).not.toBeDisabled();
  });
  
  it('starts a classic single game', async () => {
    render(<GameTypeModal isOpen={true} closeModal={mockCloseModal} />);
    
    // Make selections
    fireEvent.click(screen.getByText(/Classic/i));
    fireEvent.click(screen.getByText(/Single/i));
    fireEvent.click(screen.getByText('10'));
    
    // Start the game
    fireEvent.click(screen.getByRole('button', { name: /Start Game/i }));
    
    // Check if API was called
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/game/initialize-classic-game'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-token'
        }),
        body: JSON.stringify({ imageCount: 10 })
      })
    );
    
    // Check if game data was set
    await waitFor(() => {
      expect(mockSetGameData).toHaveBeenCalledWith(
        'test-game-123',
        10,
        expect.any(Array)
      );
    });
    
    // Check if redirected to game page
    expect(mockRouter.push).toHaveBeenCalledWith(
      '/game/classic/single?code=test-game-123'
    );
    
    // Check if modal was closed
    expect(mockCloseModal).toHaveBeenCalled();
  });
}); 