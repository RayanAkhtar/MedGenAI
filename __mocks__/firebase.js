// Mock Firebase implementation
const firebaseMock = {
  auth: {
    currentUser: {
      getIdToken: jest.fn().mockResolvedValue('mock-token'),
      displayName: 'Test User',
      email: 'test@example.com',
      uid: 'test-user-id',
    },
    onAuthStateChanged: jest.fn((callback) => {
      callback({
        email: 'test@example.com',
        displayName: 'Test User',
        uid: 'test-user-id'
      });
      return jest.fn(); // Return unsubscribe function
    }),
    signOut: jest.fn().mockResolvedValue(true),
  },
  app: {},
  // Add other Firebase services you use
};

module.exports = firebaseMock; 