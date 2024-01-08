import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PalowansContainer from './PalowansContainer';

test('renders app wrapper', () => {
  render(
    <BrowserRouter>
      <PalowansContainer />
    </BrowserRouter>
  );

  const componentWrapper = screen.getByTestId('PalowansContainer');

  expect(componentWrapper).toBeDefined();
});
