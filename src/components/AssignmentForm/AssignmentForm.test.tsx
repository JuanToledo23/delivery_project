import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AssignmentForm from './AssignmentForm';

test('renders app wrapper', () => {
  render(
    <BrowserRouter>
      <AssignmentForm value={{}} onChange={jest.fn()} />
    </BrowserRouter>
  );

  const componentWrapper = screen.getByTestId('AssignmentForm');

  expect(componentWrapper).toBeDefined();
});
