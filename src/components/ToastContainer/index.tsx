import React from 'react';
import { useTransition } from 'react-spring';

import Toast from './Toast';

import { ToastMessage } from '../../hooks/toast';

import { Container } from './styles';

interface ToastContainerProps {
  messages: ToastMessage[];
}

const ToastContainer: React.FC<ToastContainerProps> = ({ messages }) => {
  // Passar 3 parametros, passar as messages, passar uma funcao que vai obter qual eh a chave da messagem, e por ultimo um objeto contendo as animacoes
  const messagesWithTransitions = useTransition(
    messages,
    (message) => message.id,
    {
      from: { right: '-120%', opacity: 0 }, // posicao inicial
      enter: { right: '0%', opacity: 1 }, // posicao quando entra
      leave: { right: '-120%', opacity: 0 }, // posicao quando sair
    },
  );

  // Agora no map, em vez de usar as messages, vai usar as messagesWithTransitions que vai conter a message, o id e a animacao
  // item = mensagem por completo
  // key = o id da mensagem
  // props = onde tem a animacao
  return (
    <Container>
      {messagesWithTransitions.map(({ item, key, props }) => (
        <Toast key={key} style={props} message={item} />
      ))}
    </Container>
  );
};

export default ToastContainer;
