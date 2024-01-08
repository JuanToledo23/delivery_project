import { render, screen } from '@testing-library/react';
import CountrySelector from './CountrySelector';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

const countries = [
  {
    id: 1,
    name: 'México',
    flag: "mexico.svg"
  },
  {
    id: 2,
    name: 'Colombia',
    flag: "colombia.svg"
  },
  {
    id: 3,
    name: 'USA',
    flag: "usa.svg"
  }
];

describe('CountrySelector', () => {
  it('should match snapshot', () => {
    const { asFragment } = render(
      <BrowserRouter>
        <CountrySelector />
      </BrowserRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("render countries correctly", async () => {
    const listCountries = screen.getAllByTestId("list-countries");
    expect(listCountries[0]).toHaveTextContent("México");
  });

  it("onclick event radios", async () => {
    const handleChange = jest.fn();
    render(
      <CountrySelector
        countries={countries}
        onSelect={handleChange}
      />
    );
    const radioButton = screen.getAllByTestId("radio-test");
    userEvent.click(radioButton[0]);
    expect(handleChange).toHaveBeenCalled();
  });
});