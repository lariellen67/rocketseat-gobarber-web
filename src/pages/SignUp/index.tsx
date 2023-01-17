import React, { useCallback, useRef } from 'react';
import { FiArrowLeft, FiMail, FiUser, FiLock } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import api from '../../services/api';

import { useToast } from '../../hooks/toast';

import getValidationErrors from '../../utils/getValidationErrors';

import logo from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';
import SelectLanguage from '../../components/SelectLanguage';

import { Container, Content, AnimationContainer, Background } from './styles';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { t } = useTranslation();

  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: SignUpFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required(`${t('Tooltip.nameRequired')}`),
          email: Yup.string()
            .required(`${t('Tooltip.emailRequired')}`)
            .email(`${t('Tooltip.email')}`),
          password: Yup.string().min(6, `${t('Tooltip.passwordMin')}`),
        });

        await schema.validate(data, {
          abortEarly: false, // Para nao parar no primeiro erro
        });

        // Fazer o cadastro do usuario
        await api.post('/users', data);

        history.push('/');

        // Colocar o toast de sucesso
        addToast({
          type: 'success',
          title: `${t('ToastContainer.SignUp.success.title')}`,
          description: `${t('ToastContainer.SignUp.success.description')}`,
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        // Disparar um toast
        addToast({
          type: 'error',
          title: `${t('ToastContainer.SignUp.error.title')}`,
          description: `${t('ToastContainer.SignUp.error.description')}`,
        });
      }
    },
    [addToast, history, t],
  );

  return (
    <Container>
      <Background />

      <Content>
        <AnimationContainer>
          <img src={logo} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>{t('SignUp.header')}</h1>

            <Input
              name="name"
              icon={FiUser}
              placeholder={t('SignUp.inputPlaceholderName')}
              data-testid="nameField"
            />

            <Input
              name="email"
              icon={FiMail}
              placeholder={t('SignUp.inputPlaceholderEmail')}
              data-testid="emailField"
            />

            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder={t('SignUp.inputPlaceholderPassword')}
              data-testid="passowordField"
            />

            <Button type="submit" data-testid="buttonSubmit">
              {t('SignUp.buttonSignUp')}
            </Button>
          </Form>

          <Link to="/">
            <FiArrowLeft />

            {t('SignUp.buttonBackToLogon')}
          </Link>

          <SelectLanguage />
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default SignUp;
