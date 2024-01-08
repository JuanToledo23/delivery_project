import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Table from './Table';

test('renders app wrapper', () => {
  render(
    <BrowserRouter>
      <Table columns={[]} />
    </BrowserRouter>
  );

  const componentWrapper = screen.getByTestId('Table');

  expect(componentWrapper).toBeDefined();
});
