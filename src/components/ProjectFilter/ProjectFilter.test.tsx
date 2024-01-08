import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProjectFilter from './ProjectFilter';

test('renders app wrapper', () => {
  render(
    <BrowserRouter>
      <ProjectFilter />
    </BrowserRouter>
  );

  const componentWrapper = screen.getByTestId('ProjectFilter');

  expect(componentWrapper).toBeDefined();
});
