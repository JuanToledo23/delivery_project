import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProjectRegistration from './ProjectRegistration';

test('renders app wrapper', () => {
  render(
    <BrowserRouter>
      <ProjectRegistration />
    </BrowserRouter>
  );

  const componentWrapper = screen.getByTestId('ProjectRegistration');

  expect(componentWrapper).toBeDefined();
});
