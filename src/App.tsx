import React, { Suspense } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import GlobalStyle from './styles/global';

import './i18n';

import AppProvider from './hooks';

import Routes from './routes';

const App: React.FC = () => (
  <Suspense fallback={<div>Loading</div>}>
    <Router>
      <AppProvider>
        <Routes />
      </AppProvider>

      <GlobalStyle />
    </Router>
  </Suspense>
);

export default App;
