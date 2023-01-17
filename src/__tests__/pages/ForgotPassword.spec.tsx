import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import ForgotPassword from '../../pages/ForgotPassword';
import api from '../../services/api';

const apiMock = new MockAdapter(api);

const mockedHistoryPush = jest.fn();
const mockedAddToast = jest.fn();

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('react-i18next', () => {
  return {
    useTranslation: () => ({ t: (key: React.ReactNode) => key }),
  };
});

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

describe('ForgotPassword page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
    mockedAddToast.mockClear();
  });

  it('should to be able to recover password', async () => {
    apiMock.onPost('password/forgot').replyOnce(200, {});

    const { getByTestId } = render(<ForgotPassword />);

    const emailField = getByTestId('emailField');
    const buttonRecover = getByTestId('buttonRecover');

    fireEvent.change(emailField, { target: { value: 'johndoe@example.com' } });

    fireEvent.click(buttonRecover);

    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success',
        }),
      );
    });
  });

  it('should not to be able to recover password with invalids credentials', async () => {
    apiMock.onPost('password/forgot').replyOnce(200, {});

    const { getByTestId } = render(<ForgotPassword />);

    const emailField = getByTestId('emailField');
    const buttonRecover = getByTestId('buttonRecover');

    fireEvent.change(emailField, { target: { value: 'not-valid-email' } });

    fireEvent.click(buttonRecover);

    await wait(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled();
    });
  });

  // it('should display toast error when recover password fails', async () => {
  //   const { getByTestId } = render(<ForgotPassword />);

  //   apiMock.onPost('/password/forgot').replyOnce(500);

  //   const emailField = getByTestId('emailField');
  //   const buttonRecover = getByTestId('buttonRecover');

  //   fireEvent.change(emailField, { target: { value: 'johndoe@example.com' } });

  //   fireEvent.click(buttonRecover);

  //   await wait(() => {
  //     expect(mockedAddToast).toHaveBeenCalledWith(
  //       expect.objectContaining({
  //         type: 'error',
  //       }),
  //     );
  //   });
  // });
});
