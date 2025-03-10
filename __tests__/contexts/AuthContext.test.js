import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';

// Mock the useRouter result
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Create a test component that uses the AuthContext
const TestComponent = () => {
  const { user, loading } = useAuth();
  return (
    <div>
      {loading ? (
        <div data-testid="loading">Loading...</div>
      ) : user ? (
        <div data-testid="user">{user.email}</div>
      ) : (
        <div data-testid="no-user">No user logged in</div>
      )}
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    useRouter.mockReturnValue({
      push: jest.fn(),
    });
  });

  it('should initially show loading state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });
  
  it('should update state after auth is initialized', async () => {
    // Mock Firebase's onAuthStateChanged to immediately call the callback
    jest.mock('@/app/firebase/firebase', () => ({
      auth: {
        onAuthStateChanged: (callback) => {
          callback({ email: 'test@example.com' });
          return jest.fn(); // Return unsubscribe function
        },
        currentUser: { email: 'test@example.com' }
      }
    }));
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      expect(screen.getByTestId('user')).toHaveTextContent('test@example.com');
    });
  });
}); 