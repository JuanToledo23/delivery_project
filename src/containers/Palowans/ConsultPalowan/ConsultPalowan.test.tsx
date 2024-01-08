import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ConsultPalowan from './ConsultPalowan';

test('renders app wrapper', () => {
  render(
    <BrowserRouter>
      <ConsultPalowan />
    </BrowserRouter>
  );

  const componentWrapper = screen.getByTestId('ConsultPalowan');

  expect(componentWrapper).toBeDefined();
});
