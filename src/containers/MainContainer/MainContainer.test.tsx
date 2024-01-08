import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import MainContainer from './MainContainer';
import TabPanel from './MainContainer';

// test('renders app wrapper', () => {
//   render(
//     <BrowserRouter>
//       <MainContainer />
//     </BrowserRouter>
//   );

//   const componentWrapper = screen.getByTestId('MainContainer-test');

//   expect(componentWrapper).toBeDefined();
// });


describe('MainContainer', () => {
  it('should match snapshot', () => {
    const { asFragment } = render(
      <BrowserRouter>
        <MainContainer />
      </BrowserRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('should match snapshot 2', () => {
    const { asFragment } = render(
      <BrowserRouter>
        <TabPanel />
      </BrowserRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  // it("render countries correctly", async () => {
  //   const listCountries = screen.getAllByTestId("list-countries");
  //   expect(listCountries[0]).toHaveTextContent("México");
  // });

  it("onclick event radios", async () => {
    const handleChange = jest.fn();
    render(
      <MainContainer/>
    );
    const tabs = screen.getByTestId("tab-test");
    // userEvent.click(tabs);
    fireEvent.change(tabs, { target: { value: 1 } })
    expect(handleChange).toHaveBeenCalled();
  });
});