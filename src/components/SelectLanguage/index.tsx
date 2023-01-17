import React from 'react';

import { useLanguage } from '../../hooks/language';

import { Container } from './styles';

const Language18: React.FC = () => {
  const { locale, handleSelectLang } = useLanguage();

  return (
    <Container value={locale} onChange={handleSelectLang}>
      <option value="pt-BR">Português</option>
      <option value="en">English</option>
      <option value="es">Espanol</option>
      <option value="ko">Korean</option>
      <option value="chi">Chinese</option>
    </Container>
  );
};

export default Language18;
