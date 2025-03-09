import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginMock from '../mocks/LoginMock';
import { signInWithEmailAndPassword } from '@/app/firebase/login';

// Mock the login module
jest.mock('@/app/firebase/login', () => ({
  signInWithEmailAndPassword: jest.fn(),
}));

describe('Login Component', () => {
  beforeEach(() => {
    // Reset mock implementation before each test
    signInWithEmailAndPassword.mockReset();
  });
  
  it('renders login form correctly', () => {
    render(<LoginMock />);
    
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });
  
  it('validates email format', async () => {
    render(<LoginMock />);
    
    const emailInput = screen.getByPlaceholderText(/email/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    
    // Trigger form submission
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    // Check for validation error
    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
    });
    
    // Login function should not be called
    expect(signInWithEmailAndPassword).not.toHaveBeenCalled();
  });
  
  it('handles successful login', async () => {
    signInWithEmailAndPassword.mockResolvedValue({});
    
    render(<LoginMock />);
    
    // Fill in the form
    fireEvent.change(screen.getByPlaceholderText(/email/i), { 
      target: { value: 'test@example.com' } 
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { 
      target: { value: 'password123' } 
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    // Verify the login function was called with correct args
    await waitFor(() => {
      expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
        'test@example.com',
        'password123'
      );
    });
  });
  
  it('handles login errors', async () => {
    // Mock the login function to throw an error
    signInWithEmailAndPassword.mockRejectedValue(
      new Error('Invalid email or password')
    );
    
    render(<LoginMock />);
    
    // Fill in the form
    fireEvent.change(screen.getByPlaceholderText(/email/i), { 
      target: { value: 'test@example.com' } 
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { 
      target: { value: 'wrong-password' } 
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    // Check for error message
    await waitFor(() => {
      expect(screen.getByText(/Invalid email or password/i)).toBeInTheDocument();
    });
  });
}); 