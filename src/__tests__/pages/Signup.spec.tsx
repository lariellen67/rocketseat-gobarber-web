import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import SignUp from '../../pages/SignUp';
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

describe('SignUp page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
    mockedAddToast.mockClear();
  });

  it('should to able to sign up', async () => {
    apiMock.onPost('users').replyOnce(200, {});

    const { getByTestId } = render(<SignUp />);

    const nameField = getByTestId('nameField');
    const emailField = getByTestId('emailField');
    const passowordField = getByTestId('passowordField');
    const buttonSubmit = getByTestId('buttonSubmit');

    fireEvent.change(nameField, { target: { value: 'John Doe' } });
    fireEvent.change(emailField, { target: { value: 'johndoe@example.com' } });
    fireEvent.change(passowordField, { target: { value: '123456' } });

    fireEvent.click(buttonSubmit);

    await wait(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/');
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success',
        }),
      );
    });
  });

  it('should not to able to sign up with invalid credentials', async () => {
    const { getByTestId } = render(<SignUp />);

    const nameField = getByTestId('nameField');
    const emailField = getByTestId('emailField');
    const passowordField = getByTestId('passowordField');
    const buttonSubmit = getByTestId('buttonSubmit');

    fireEvent.change(nameField, { target: { value: 'John Doe' } });
    fireEvent.change(emailField, { target: { value: 'not-valid-email' } });
    fireEvent.change(passowordField, { target: { value: '123456' } });

    fireEvent.click(buttonSubmit);

    await wait(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled();
    });
  });

  it('should display toast error when sign up fails', async () => {
    apiMock.onPost('users').replyOnce(400);

    const { getByTestId } = render(<SignUp />);

    const nameField = getByTestId('nameField');
    const emailField = getByTestId('emailField');
    const passowordField = getByTestId('passowordField');
    const buttonSubmit = getByTestId('buttonSubmit');

    fireEvent.change(nameField, { target: { value: 'John Doe' } });
    fireEvent.change(emailField, { target: { value: 'johndoe@example.com' } });
    fireEvent.change(passowordField, { target: { value: '123456' } });

    fireEvent.click(buttonSubmit);

    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });
  });
});
