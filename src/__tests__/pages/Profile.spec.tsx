import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';

import Profile from '../../pages/Profile';
import api from '../../services/api';

const mockedHistoryPush = jest.fn();
const mockedUpdateUser = jest.fn();
const mockedAddToast = jest.fn();
// const mockedInitialData = jest.fn();

// Criar um mock, para sempre quando for rodar um teste, criar um mock, e todos os proximos testes vao utilizar esse mock
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

jest.mock('../../hooks/auth', () => {
  return {
    useAuth: () => ({
      updateUser: mockedUpdateUser,
      user: {
        name: 'John Doe',
        email: 'johndoe@example.com',
      },
    }),
  };
});

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

const apiMock = new MockAdapter(api);

describe('Profile Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
    mockedUpdateUser.mockClear();
    mockedAddToast.mockClear();
  });

  it('should able update profile', async () => {
    const { getByTestId } = render(<Profile />);

    const userUpdate = {
      name: 'John Doe',
      email: 'johndoe@example.com',
    };

    apiMock.onPut('/profile').replyOnce(200, userUpdate);

    const nameField = getByTestId('nameField');
    const emailField = getByTestId('emailField');

    const buttonSubmit = getByTestId('buttonSubmit');

    fireEvent.change(nameField, { target: { value: userUpdate.name } });
    fireEvent.change(emailField, { target: { value: userUpdate.email } });

    fireEvent.click(buttonSubmit);

    // O wait vai executar esse expect ate dar certo! Ele eh usado exatamente para algo que demora
    await wait(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard');
      expect(mockedUpdateUser).toHaveBeenCalledWith(userUpdate);
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success',
        }),
      );
    });
  });

  it('should able update all datas in profile', async () => {
    const { getByTestId } = render(<Profile />);

    const userUpdate = {
      name: 'John Doe',
      email: 'johndoe@example.com',
    };

    apiMock.onPut('/profile').replyOnce(200, userUpdate);

    const nameField = getByTestId('nameField');
    const emailField = getByTestId('emailField');
    const oldPasswordField = getByTestId('oldPasswordField');
    const passwordField = getByTestId('passwordField');
    const passwordConfirmationField = getByTestId('passwordConfirmationField');

    const buttonSubmit = getByTestId('buttonSubmit');

    fireEvent.change(nameField, { target: { value: userUpdate.name } });
    fireEvent.change(emailField, { target: { value: userUpdate.email } });
    fireEvent.change(oldPasswordField, { target: { value: '123456' } });
    fireEvent.change(passwordField, { target: { value: '123123' } });
    fireEvent.change(passwordConfirmationField, {
      target: { value: '123123' },
    });

    fireEvent.click(buttonSubmit);

    // O wait vai executar esse expect ate dar certo! Ele eh usado exatamente para algo que demora
    await wait(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard');
      expect(mockedUpdateUser).toHaveBeenCalledWith(userUpdate);
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success',
        }),
      );
    });
  });

  it('should not be able update profile with invalid credetials in fields ', async () => {
    const { getByTestId } = render(<Profile />);

    const userUpdate = {
      name: 'John Doe',
      email: 'not-valid-email',
    };

    // apiMock.onPut('/profile').replyOnce(400, userUpdate);

    const nameField = getByTestId('nameField');
    const emailField = getByTestId('emailField');

    const buttonSubmit = getByTestId('buttonSubmit');

    fireEvent.change(nameField, { target: { value: userUpdate.name } });
    fireEvent.change(emailField, { target: { value: userUpdate.email } });

    fireEvent.click(buttonSubmit);

    await wait(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled();
    });
  });

  it('should not be able to update profile with password does not match password_confirmation', async () => {
    const { getByTestId } = render(<Profile />);

    const userUpdate = {
      name: 'John Doe',
      email: 'johndoe@example.com',
    };

    const nameField = getByTestId('nameField');
    const emailField = getByTestId('emailField');
    const oldPasswordField = getByTestId('oldPasswordField');
    const passwordField = getByTestId('passwordField');
    const passwordConfirmationField = getByTestId('passwordConfirmationField');

    const buttonSubmit = getByTestId('buttonSubmit');

    fireEvent.change(nameField, { target: { value: userUpdate.name } });
    fireEvent.change(emailField, { target: { value: userUpdate.email } });
    fireEvent.change(oldPasswordField, { target: { value: '123456' } });
    fireEvent.change(passwordField, { target: { value: '123123' } });
    fireEvent.change(passwordConfirmationField, {
      target: { value: 'password-confirmation-not-match' },
    });

    fireEvent.click(buttonSubmit);

    // O wait vai executar esse expect ate dar certo! Ele eh usado exatamente para algo que demora
    await wait(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled();
    });
  });

  it('should not be able update profile if has an error', async () => {
    const { getByTestId } = render(<Profile />);

    apiMock.onPut('/profile').replyOnce(400);

    const nameField = getByTestId('nameField');
    const emailField = getByTestId('emailField');

    const buttonSubmit = getByTestId('buttonSubmit');

    fireEvent.change(nameField, { target: { value: 'John Doe' } });
    fireEvent.change(emailField, { target: { value: 'johndoe@example.com' } });

    fireEvent.click(buttonSubmit);

    // O wait vai executar esse expect ate dar certo! Ele eh usado exatamente para algo que demora
    await wait(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled();
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });
  });

  it('should be able to update avatar', async () => {
    const { getByTestId } = render(<Profile />);

    apiMock.onPatch('/users/avatar').replyOnce(200);

    const inputFile = getByTestId('input-file');

    fireEvent.change(inputFile, { target: { files: ['file-test'] } });

    await wait(() => {
      expect(mockedUpdateUser).toHaveBeenCalled();
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success',
        }),
      );
    });
  });
});
