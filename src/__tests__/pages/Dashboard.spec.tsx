import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import DayPicker from 'react-day-picker';
import Profile from '../../pages/Profile';
import api from '../../services/api';

import Dashboard from '../../pages/Dashboard';

const mockedHistoryPush = jest.fn();
const mockedSignOut = jest.fn();

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('../../hooks/auth', () => {
  return {
    useAuth: () => ({
      signOut: mockedSignOut,
      user: {
        name: 'John Doe',
        email: 'johndoe@example.com',
      },
    }),
  };
});

describe('Dashboard Page', () => {
  it('should be to sign out', () => {
    const { getByTestId } = render(<Dashboard />);

    const buttonSignOut = getByTestId('button-signOut');

    fireEvent.click(buttonSignOut);

    expect(mockedSignOut).toHaveBeenCalled();
  });

  it('should be change month', () => {
    const { getByLabelText } = render(<Dashboard />);

    const arrowRight = getByLabelText('Next Month');

    fireEvent.click(arrowRight);

    expect(mockedHistoryPush).not.toHaveBeenCalled();
  });
});
