import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProjectAssignments from './ProjectAssignments';

test('renders app wrapper', () => {
  render(
    <BrowserRouter>
      <ProjectAssignments />
    </BrowserRouter>
  );

  const componentWrapper = screen.getByTestId('ProjectAssignments');

  expect(componentWrapper).toBeDefined();
});
