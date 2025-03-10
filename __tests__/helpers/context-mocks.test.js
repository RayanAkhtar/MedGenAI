import { MockGameProvider, useMockGame } from './context-mocks';

describe('Context mocks', () => {
  it('should export the required mocks', () => {
    expect(MockGameProvider).toBeDefined();
    expect(useMockGame).toBeDefined();
  });
}); 