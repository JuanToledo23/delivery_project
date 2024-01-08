import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EditPalowan from './EditPalowan';

test('renders app wrapper', () => {
  render(
    <BrowserRouter>
      <EditPalowan />
    </BrowserRouter>
  );

  const componentWrapper = screen.getByTestId('EditPalowan');

  expect(componentWrapper).toBeDefined();
});
