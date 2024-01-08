import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app wrapper', () => {
  render(<App />);

  const AppWrapper = screen.getByTestId('App');

  expect(AppWrapper).toBeDefined();
});
