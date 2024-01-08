import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Quoter from './Quoter';

test('renders app wrapper', () => {
  render(
    <BrowserRouter>
      <Quoter />
    </BrowserRouter>
  );

  const componentWrapper = screen.getByTestId('Quoter');

  expect(componentWrapper).toBeDefined();
});
