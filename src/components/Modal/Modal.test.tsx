import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Modal from './Modal';

test('renders app wrapper', () => {
  render(
    <BrowserRouter>
      <Modal open={true} />
    </BrowserRouter>
  );

  const componentWrapper = screen.getByTestId('Modal');

  expect(componentWrapper).toBeDefined();
});
