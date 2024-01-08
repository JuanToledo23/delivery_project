import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Assignment from './Assignment';

test('renders app wrapper', () => {
  render(
    <BrowserRouter>
      <Assignment />
    </BrowserRouter>
  );

  const componentWrapper = screen.getByTestId('Assignment');

  expect(componentWrapper).toBeDefined();
});
