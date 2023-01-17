import React, { useEffect } from 'react';
import {
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
  FiXCircle,
} from 'react-icons/fi';

import { useToast, ToastMessage } from '../../../hooks/toast';

import { Container } from './styles';

interface ToastProps {
  message: ToastMessage;
  style: object;
}

// Colocar o icone dependendo do type
const icons = {
  info: <FiInfo size={24} />,
  error: <FiAlertCircle size={24} />,
  success: <FiCheckCircle size={24} />,
};

const Toast: React.FC<ToastProps> = ({ message, style }) => {
  // Pegar a funcao de remover o toast e adicionar ao button
  const { removeToast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(message.id);
    }, 3000);

    // Vai executar automaticamente se o componente deixar de existir
    return () => {
      clearTimeout(timer);
    };
  }, [removeToast, message.id]);

  return (
    <Container
      type={message.type}
      hasDescription={Number(!!message.description)} // True = 1, False = 0
      style={style}
    >
      {icons[message.type || 'info']}

      <div>
        <strong data-testid="title">{message.title}</strong>
        {message.description && <p>{message.description}</p>}
      </div>

      <button
        onClick={() => removeToast(message.id)}
        type="button"
        data-testid="button-removeToast"
      >
        <FiXCircle size={18} />
      </button>
    </Container>
  );
};

export default Toast;
