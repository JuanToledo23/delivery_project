import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PalowanRegistration from './PalowanRegistration';

test('renders app wrapper', () => {
  render(
    <BrowserRouter>
      <PalowanRegistration />
    </BrowserRouter>
  );

  const componentWrapper = screen.getByTestId('PalowanRegistration');

  expect(componentWrapper).toBeDefined();
});
