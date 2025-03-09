import { render } from '@testing-library/react';
import { AuthProvider } from '@/app/context/AuthContext';
import { GameProvider } from '@/app/context/GameContext';

// Custom render function that includes providers
const customRender = (ui, options = {}) => {
  return render(
    <AuthProvider>
      <GameProvider>
        {ui}
      </GameProvider>
    </AuthProvider>,
    options
  );
};

// re-export everything from testing-library
export * from '@testing-library/react';

// override render method
export { customRender as render }; 