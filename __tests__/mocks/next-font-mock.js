// Mock for Next.js font
jest.mock('next/font/google', () => ({
  Geist: () => ({ variable: 'mock-font' }),
  Geist_Mono: () => ({ variable: 'mock-mono-font' })
})); 