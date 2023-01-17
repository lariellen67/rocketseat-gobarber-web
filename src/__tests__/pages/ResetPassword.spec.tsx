import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import ResetPassword from '../../pages/ResetPassword';
import api from '../../services/api';

const apiMock = new MockAdapter(api);

const mockedHistoryPush = jest.fn();
const mockedLocationSearch = jest.fn();
const mockedAddToast = jest.fn();

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    useLocation: () => ({
      search: {
        replace: mockedLocationSearch,
      },
    }),
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

describe('SignUp page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
    mockedAddToast.mockClear();
    mockedLocationSearch.mockClear();
  });

  it('should be able to reset password', async () => {
    apiMock.onPost('password/reset').replyOnce(200);

    mockedLocationSearch.mockImplementation(() => {
      return 'token-123';
    });

    const { getByTestId } = render(<ResetPassword />);

    const newPasswordField = getByTestId('newPasswordField');
    const confirmPasswordField = getByTestId('confirmPasswordField');

    const buttonChangePassword = getByTestId('buttonChangePassword');

    fireEvent.change(newPasswordField, { target: { value: '123456' } });
    fireEvent.change(confirmPasswordField, { target: { value: '123456' } });

    fireEvent.click(buttonChangePassword);

    await wait(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/');
    });
  });

  it('should not to be able to reset password with invalid password confirmation', async () => {
    apiMock.onPost('password/reset').replyOnce(400);

    mockedLocationSearch.mockImplementation(() => {
      return 'token-123';
    });

    const { getByTestId } = render(<ResetPassword />);

    const newPasswordField = getByTestId('newPasswordField');
    const confirmPasswordField = getByTestId('confirmPasswordField');

    const buttonChangePassword = getByTestId('buttonChangePassword');

    fireEvent.change(newPasswordField, { target: { value: '123456' } });
    fireEvent.change(confirmPasswordField, {
      target: { value: 'wrong-password' },
    });

    fireEvent.click(buttonChangePassword);

    await wait(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled();
    });
  });

  it('should not to be able to reset password with invalid token', async () => {
    apiMock.onPost('password/reset').replyOnce(400);

    mockedLocationSearch.mockImplementation(() => {
      return undefined;
    });

    const { getByTestId } = render(<ResetPassword />);

    const newPasswordField = getByTestId('newPasswordField');
    const confirmPasswordField = getByTestId('confirmPasswordField');

    const buttonChangePassword = getByTestId('buttonChangePassword');

    fireEvent.change(newPasswordField, { target: { value: '123456' } });
    fireEvent.change(confirmPasswordField, { target: { value: '123456' } });

    fireEvent.click(buttonChangePassword);

    await wait(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled();
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });
  });

  it('should display toast with erros if reset password fails', async () => {
    apiMock.onPost('password/reset').replyOnce(400);

    mockedLocationSearch.mockImplementation(() => {
      return 'token-123';
    });

    const { getByTestId } = render(<ResetPassword />);

    const newPasswordField = getByTestId('newPasswordField');
    const confirmPasswordField = getByTestId('confirmPasswordField');

    const buttonChangePassword = getByTestId('buttonChangePassword');

    fireEvent.change(newPasswordField, { target: { value: '123456' } });
    fireEvent.change(confirmPasswordField, { target: { value: '123456' } });

    fireEvent.click(buttonChangePassword);

    await wait(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled();
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });
  });
});
