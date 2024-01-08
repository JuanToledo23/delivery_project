import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';

test('renders app wrapper', () => {
  render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  );

  const componentWrapper = screen.getByTestId('Home');

  expect(componentWrapper).toBeDefined();
});
