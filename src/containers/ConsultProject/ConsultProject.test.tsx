import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ConsultProject from './ConsultProject';

test('renders app wrapper', () => {
  render(
    <BrowserRouter>
      <ConsultProject />
    </BrowserRouter>
  );

  const componentWrapper = screen.getByTestId('ConsultProject');

  expect(componentWrapper).toBeDefined();
});
