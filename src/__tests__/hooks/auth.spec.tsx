import { renderHook, act } from '@testing-library/react-hooks';
import MockAdapter from 'axios-mock-adapter';
import { useAuth, AuthProvider } from '../../hooks/auth';
import api from '../../services/api';

const apiMock = new MockAdapter(api);

describe('Auth hook', () => {
  it('should be able to sign in', async () => {
    const apiResponse = {
      user: {
        id: 'user123',
        name: 'John Doe',
        email: 'johndoe@example.com',
      },
      token: 'token-123',
    };

    apiMock.onPost('sessions').reply(200, apiResponse);

    // Storage - API do localStorage no javascript.
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    // Deixa os hooks amostra pra usar
    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    result.current.signIn({
      email: 'johndoe@example.com',
      password: '123456',
    });

    await waitForNextUpdate();

    // Verificar se o setItemSpy foi chamado com o parametro '@GoBarber:token' e o token
    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:token',
      apiResponse.token,
    );

    // Verificar se o setItemSpy foi chamado com o parametro '@GoBarber:user' e as informacoes do user
    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(apiResponse.user),
    );

    expect(result.current.user.email).toEqual('johndoe@example.com');
  });

  it('should restore save data from storage when auth inits', () => {
    // Vou reescrever a funcao getItem, caso for @GoBarber:token retorna o token, @GoBarber:user retorna user, se nao for nada retorna nulo.
    // Ai ele vai deixar esse dados como ja estivesse "SALVO"
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      switch (key) {
        case '@GoBarber:token':
          return 'token-123';

        case '@GoBarber:user':
          return JSON.stringify({
            id: 'user123',
            name: 'John Doe',
            email: 'johndoe@example.com',
          });

        default:
          return null;
      }
    });

    // Deixa os hooks amostra pra usar
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.user.email).toEqual('johndoe@example.com');
  });

  it('should be able to sign out', async () => {
    // Para iniciar o usuario com algumas informacoes
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      switch (key) {
        case '@GoBarber:token':
          return 'token-123';

        case '@GoBarber:user':
          return JSON.stringify({
            id: 'user123',
            name: 'John Doe',
            email: 'johndoe@example.com',
          });

        default:
          return null;
      }
    });

    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');

    // Deixa os hooks amostra pra usar
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.signOut();
    }); // Como a signOut eh um funcao sincrona, e nao assincrona (async), usa o act e nao o waitForNextUpdate

    // Espero que a funcao "localStorage.removeItem", como esta no codigo de auth.tsx updateUser, tenha sido chamada duas vezes
    expect(removeItemSpy).toHaveBeenCalledTimes(2);
    expect(result.current.user).toBeUndefined(); // No signOut quando faz logout, set o user como vazio
  });

  it('should be able to update user data', async () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    // Deixa os hooks amostra pra usar
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    const user = {
      id: 'user123',
      name: 'John Doe',
      email: 'johndoe@example.com',
      avatar_url: 'image-test.jpg',
    };

    act(() => {
      result.current.updateUser(user);
    });

    // Espero que a funcao "localStorage.setItem", como esta no codigo de auth.tsx updateUser, tenha sido chamada com isso
    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(user),
    );

    // Espero que os dados do usuario salvo no auth seja igual a esse user.
    expect(result.current.user).toEqual(user);
  });
});
