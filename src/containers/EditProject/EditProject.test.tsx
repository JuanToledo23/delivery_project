import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Edit from './EditProject';

test('renders app wrapper', () => {
  render(
    <BrowserRouter>
      <Edit />
    </BrowserRouter>
  );

  const componentWrapper = screen.getByTestId('Edit');

  expect(componentWrapper).toBeDefined();
});
