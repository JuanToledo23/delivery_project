import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Registration from './Registration';

test('renders app wrapper', () => {
  render(
    <BrowserRouter>
      <Registration />
    </BrowserRouter>
  );

  const componentWrapper = screen.getByTestId('Registration');

  expect(componentWrapper).toBeDefined();
});
