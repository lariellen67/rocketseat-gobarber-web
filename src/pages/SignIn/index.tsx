import React, { useCallback, useRef } from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';

import getValidationErrors from '../../utils/getValidationErrors';

import logo from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import SelectLanguage from '../../components/SelectLanguage';

import { Container, Content, AnimationContainer, Background } from './styles';

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { t } = useTranslation();

  const { signIn } = useAuth();
  const { addToast } = useToast();

  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: SignInFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required(`${t('Tooltip.emailRequired')}`)
            .email(`${t('Tooltip.email')}`),
          password: Yup.string().required(`${t('Tooltip.password')}`),
        });

        await schema.validate(data, {
          abortEarly: false, // Para nao parar no primeiro erro
        });

        await signIn({
          email: data.email,
          password: data.password,
        });

        // Depois de ser autenticado, vai ser enviado a rota de dashboard
        history.push('/dashboard');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        // Disparar um toast
        addToast({
          type: 'error',
          title: `${t('ToastContainer.SignIn.error.title')}`,
          description: `${t('ToastContainer.SignIn.error.description')}`,
        });
      }
    },
    [signIn, addToast, history, t],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logo} alt="GoBarber" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>{t('SingIn.header')}</h1>

            <Input name="email" icon={FiMail} placeholder="E-mail" />

            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Senha"
            />

            <Button type="submit">Entrar</Button>

            <Link to="forgot-password">{t('SingIn.forgetPassword')}</Link>
          </Form>

          <Link to="/signup">
            <FiLogIn />
            <span>{t('SingIn.createAccount')}</span>
          </Link>

          <SelectLanguage />
        </AnimationContainer>
      </Content>

      <Background />
    </Container>
  );
};

export default SignIn;
