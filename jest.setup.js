import '@testing-library/jest-dom';

// Mock the Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn().mockImplementation((param) => {
      if (param === 'code') return 'test-game-id';
      return null;
    })
  })
}));

// Create a comprehensive Firebase mock
jest.mock('@/app/firebase/firebase', () => {
  const auth = {
    currentUser: {
      getIdToken: jest.fn().mockResolvedValue('mock-token'),
      displayName: 'Test User',
      email: 'test@example.com'
    },
    onAuthStateChanged: jest.fn((callback) => {
      // Simulate an authenticated user
      callback({
        email: 'test@example.com',
        displayName: 'Test User',
        uid: 'test-user-id'
      });
      // Return unsubscribe function
      return jest.fn();
    }),
    signOut: jest.fn().mockResolvedValue(true),
  };

  return {
    auth,
    app: {},
  };
});

// Mock Firebase authentication modules
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({
    currentUser: {
      getIdToken: jest.fn().mockResolvedValue('mock-token'),
      displayName: 'Test User',
      email: 'test@example.com'
    },
    onAuthStateChanged: jest.fn()
  })),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
}));

// Mock global fetch
global.fetch = jest.fn(); 