import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProjectInformation from './ProjectInformation';

test('renders app wrapper', () => {
  render(
    <BrowserRouter>
      <ProjectInformation />
    </BrowserRouter>
  );

  const componentWrapper = screen.getByTestId('ProjectInformation');

  expect(componentWrapper).toBeDefined();
});
