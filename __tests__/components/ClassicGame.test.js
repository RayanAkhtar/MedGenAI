import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ClassicGame from '@/app/game/classic/single/page';
import { useGame } from '@/app/context/GameContext';
import { useAuth } from '@/app/context/AuthContext';

// Mock the context hooks
jest.mock('@/app/context/GameContext', () => ({
  useGame: jest.fn(),
}));

jest.mock('@/app/context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('ClassicGame Component', () => {
  beforeEach(() => {
    // Setup default mock implementations
    useGame.mockReturnValue({
      gameId: 'test-game-id',
      imageCount: 5,
      images: [
        { id: 1, path: '/test1.jpg', type: 'real' },
        { id: 2, path: '/test2.jpg', type: 'ai' },
        { id: 3, path: '/test3.jpg', type: 'real' },
        { id: 4, path: '/test4.jpg', type: 'ai' },
        { id: 5, path: '/test5.jpg', type: 'real' },
      ],
      setGameData: jest.fn(),
      clearGameData: jest.fn(),
    });
    
    useAuth.mockReturnValue({
      user: { id: 'user-1', email: 'test@example.com' },
      loading: false,
    });
    
    // Reset fetch mock
    global.fetch.mockReset();
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ status: 'success' }),
    });
  });
  
  it('renders game rules on initial load', () => {
    render(<ClassicGame />);
    
    expect(screen.getByText(/Game #test-game-id/i)).toBeInTheDocument();
    expect(screen.getByText(/Analyze 5 images/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Start Playing/i })).toBeInTheDocument();
  });
  
  it('starts game after closing rules modal', () => {
    render(<ClassicGame />);
    
    // Close rules modal
    fireEvent.click(screen.getByRole('button', { name: /Start Playing/i }));
    
    // Game UI should be visible
    expect(screen.getByText(/Real or AI\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Score: 0/i)).toBeInTheDocument();
    expect(screen.getByText(/Image: 1\/5/i)).toBeInTheDocument();
    
    // Game controls should be available
    expect(screen.getByRole('button', { name: /Real Image/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /AI Generated/i })).toBeInTheDocument();
  });
  
  it('shows feedback after making a guess', async () => {
    render(<ClassicGame />);
    
    // Close rules modal
    fireEvent.click(screen.getByRole('button', { name: /Start Playing/i }));
    
    // Make correct guess for first image (real)
    fireEvent.click(screen.getByRole('button', { name: /Real Image/i }));
    
    // Should show feedback overlay
    await waitFor(() => {
      expect(screen.getByText('Correct!')).toBeInTheDocument();
    });
  });
  
  it('completes game after all images', async () => {
    const mockSubmitGameResults = jest.fn().mockResolvedValue({});
    
    render(<ClassicGame submitGameResults={mockSubmitGameResults} />);
    
    // Close rules modal
    fireEvent.click(screen.getByRole('button', { name: /Start Playing/i }));
    
    // Go through all 5 images
    for (let i = 0; i < 5; i++) {
      const isReal = [0, 2, 4].includes(i); // Images at index 0, 2, 4 are 'real'
      
      // Select the correct answer based on image type
      fireEvent.click(screen.getByRole('button', { 
        name: isReal ? /Real Image/i : /AI Generated/i 
      }));
      
      // If it's an AI image, we need to handle the marker and feedback
      if (!isReal) {
        // Wait for feedback to close and marker prompt to appear
        await waitFor(() => {
          expect(screen.queryByText(/click on the part/i)).toBeInTheDocument();
        });
        
        // Click on image to place marker
        const image = screen.getByAltText(/Game image/i);
        fireEvent.click(image);
        
        // Submit feedback
        await waitFor(() => {
          const submitButton = screen.getByRole('button', { name: /Submit & Continue/i });
          fireEvent.click(submitButton);
        });
      } else {
        // For real images, just wait for feedback to close
        await waitFor(() => {
          expect(screen.queryByText('Correct!')).toBeInTheDocument();
        });
      }
    }
    
    // After all images, should show completion screen
    await waitFor(() => {
      expect(screen.getByText(/Game Complete!/i)).toBeInTheDocument();
      expect(screen.getByText(/Final Score: 5\/5/i)).toBeInTheDocument();
    });
  });
}); 