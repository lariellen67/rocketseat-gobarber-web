import React from 'react';
import {
  Route as ReactDOMRoute,
  RouteProps as ReactDOMRouteProps,
  Redirect,
} from 'react-router-dom';

import { useAuth } from '../hooks/auth';

interface RouteProps extends ReactDOMRouteProps {
  isPrivate?: boolean;
  component: React.ComponentType;
}

// ROTA PRIVADA/AUTENTICADO
// true/true = OK
// true/false = Redirecionar ele pro login
// false/true = Redirecionar para o dashboard
// false/false = OK

const Route: React.FC<RouteProps> = ({
  isPrivate = false,
  component: Component,
  ...rest
}) => {
  const { user } = useAuth();

  return (
    <ReactDOMRoute
      {...rest}
      render={({ location }) => {
        // Se isPrivate for igual ao !!user, retorna o component. true com true, false com false.
        // Se nao, redirecionar.
        // Se a rota for privada, que ele esta tentando acessar, redirecionar para o login "/"
        // Se a rota for publica, que ele esta tentando acessar, redirecionar para o dashboard "/dashboard"
        // state: manter o historico
        return isPrivate === !!user ? (
          <Component />
        ) : (
          <Redirect
            to={{
              pathname: isPrivate ? '/' : '/dashboard',
              state: { from: location },
            }}
          />
        );
      }}
    />
  );
};

export default Route;
