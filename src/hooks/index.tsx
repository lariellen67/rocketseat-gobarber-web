import React from 'react';

import { AuthProvider } from './auth';
import { ToastProvider } from './toast';
import { LanguageProvider } from './language';

const AppProvider: React.FC = ({ children }) => (
  <AuthProvider>
    <LanguageProvider>
      <ToastProvider>{children}</ToastProvider>
    </LanguageProvider>
  </AuthProvider>
);

export default AppProvider;
