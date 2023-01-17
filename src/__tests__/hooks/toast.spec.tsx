import { renderHook, act } from '@testing-library/react-hooks';
import { useToast, ToastProvider } from '../../hooks/toast';

describe('Auth hook', () => {
  it('should be able toast', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useToast(), {
      wrapper: ToastProvider,
    });

    const toast = {
      title: 'Teste',
      description: 'Teste',
      type: 'success',
    };

    act(() => {
      result.current.addToast({
        title: 'Teste',
        description: 'Teste',
        type: 'success',
      });
    });

    await waitForNextUpdate();

    expect(toast.title).toEqual('Teste');
    expect(toast.description).toEqual('Teste');
    expect(toast.type).toEqual('success');
  });
});
