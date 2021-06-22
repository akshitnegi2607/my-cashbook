import { render, screen, fireEvent, waitFor, waitForElement, act} from '@testing-library/react';

import {
  getByLabelText,
  getByText,
  getByTestId,
  queryByTestId,
} from '@testing-library/dom';

import { rest } from 'msw'
import userEvent from '@testing-library/user-event'
import { setupServer } from 'msw/node'
import App from './App';

import handlers from './mocks/handlers';

const server = setupServer(handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())


test('document should contain my cashbook', () => {
  render(<App />);
  const bookingElement = screen.getByText(/My Cashbook/i);
  expect(bookingElement).toBeInTheDocument();
});



test('create a entry for cash-in', async () => {

  render(<App />);

  fireEvent.click(screen.getByTestId('cashin-btn'))

  fireEvent.change(screen.getByTestId(/amount/i), {
    target: {value: parseFloat(50.00)},
  })

  fireEvent.change(screen.getByTestId(/note/i), {
    target: {value: 'foobar'},
  })

  const createbtn = screen.getByTestId('create-entry-btn')


  expect(createbtn.disabled).toBe(false)

  fireEvent.click(screen.getByTestId('create-entry-btn'))


});


test('create a entry for cash-out', async () => {

  render(<App />);

  expect(screen.getByText(/No Entry Found!/i)).toBeInTheDocument();

  fireEvent.click(screen.getByTestId('cashout-btn'))

  fireEvent.change(screen.getByTestId(/amount/i), {
    target: {value: parseFloat(50.00)},
  })

  fireEvent.change(screen.getByTestId(/note/i), {
    target: {value: 'foo'},
  })

  const createbtn = screen.getByTestId('create-entry-btn')


  expect(createbtn.disabled).toBe(false)

  fireEvent.click(screen.getByTestId('create-entry-btn'))


});


test('test to validate the zero balance', async () => {

  render(<App />);

  await waitFor(() =>
    expect(screen.getByTestId('balance')).toHaveTextContent(/0 INR/i)
  )

});
