import { render } from '@testing-library/react';
import Login from './Login';
import { BrowserRouter } from 'react-router-dom';

describe('Login', () => {
  it('should match snapshot', () => {
    const { asFragment } = render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});