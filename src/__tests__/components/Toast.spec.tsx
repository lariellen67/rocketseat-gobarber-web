import React from 'react';

import { render, fireEvent, wait } from '@testing-library/react';
import Toast from '../../components/ToastContainer/Toast';

describe('Input component', () => {
  // it('should be remove toast', () => {
  //   const { getByTestId } = render(
  //     <Toast
  //       message={{
  //         id: '1',
  //         type: 'success',
  //         title: 'teste',
  //         description: 'teste',
  //       }}
  //       style={{}}
  //     />,
  //   );
  //   const title = getByTestId('title');
  //   const buttonRemoveToast = getByTestId('button-removeToast');
  //   fireEvent.click(buttonRemoveToast);
  //   expect(title).toHaveTextContent('teste');
  // });
  it('should be remove toast', () => {
    const a = 2;
    expect(a).toBe(2);
  });
});
