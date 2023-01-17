import React, { createContext, useCallback, useState, useContext } from 'react';

import api from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
}

interface AuthState {
  token: string;
  user: User;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: User;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  updateUser(user: User): void;
}

// usou as AuthContext para burlar o erro
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  // Para salvar as informacoes de token e user, para nao ficar pegando do localStorage  toda hora
  // Preencher automaticamente se ouver um token e user no localStorage
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@GoBarber:token');
    const user = localStorage.getItem('@GoBarber:user');

    if (token && user) {
      // Quando da um F5
      api.defaults.headers.authorization = `Bearer ${token}`;

      return { token, user: JSON.parse(user) }; // Transforma uma string em um objeto.
    }

    // Se nao tiver nada, retorna um objeto vazio.
    return {} as AuthState;
  });

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post('/sessions', {
      email,
      password,
    });

    // Manter o usuario no localStorage
    const { token, user } = response.data;

    // Salvando no localStorage
    localStorage.setItem('@GoBarber:token', token);
    localStorage.setItem('@GoBarber:user', JSON.stringify(user)); // O user eh um objeto, preciso converter em uma string

    // Quando fizer login na aplicacao
    api.defaults.headers.authorization = `Bearer ${token}`;

    // Quando eu fizer o login, atualizar o data, para pegar as informacoes dele. O data pega as informacoes la do localStorage com o getItem
    setData({ token, user });
  }, []);

  //
  const signOut = useCallback(() => {
    localStorage.removeItem('@GoBarber:token');
    localStorage.removeItem('@GoBarber:user');

    setData({} as AuthState);
  }, []);

  // Atualizar a imagem e o perfil do usuario
  const updateUser = useCallback(
    (user: User) => {
      localStorage.setItem('@GoBarber:user', JSON.stringify(user)); // E precisa atualizar essa informacoes do avatar no localStorage tambem, se nao o react vai buscar por uma {user.avatar_url} que nao existe na img na pagina profile

      setData({
        token: data.token,
        user,
      });
    },
    [setData, data.token],
  );

  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, useAuth };
