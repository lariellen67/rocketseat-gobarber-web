import React, { useCallback, useRef, ChangeEvent } from 'react';
import { FiMail, FiUser, FiLock, FiCamera, FiArrowLeft } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { useHistory, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import api from '../../services/api';

import { useToast } from '../../hooks/toast';

import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, AvatarInput } from './styles';
import { useAuth } from '../../hooks/auth';

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { t } = useTranslation();

  const { addToast } = useToast();
  const history = useHistory();

  const { user, updateUser } = useAuth();

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required(`${t('Tooltip.nameRequired')}`),
          email: Yup.string()
            .required(`${t('Tooltip.emailRequired')}`)
            .email(`${t('Tooltip.email')}`),

          old_password: Yup.string(),

          // Se o campo old_password estiver preenchido, vai verificar o tamanho o campo length e transformar num booleano, entao o campo password eh string e obrigatorio, se nao eh somente um campo string.
          password: Yup.string().when('old_password', {
            is: (value) => !!value.length,
            then: Yup.string().required('Campo obrigatório'),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string()
            .when('old_password', {
              is: (value) => !!value.length,
              then: Yup.string().required('Campo obrigatório'),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref('password'), null], 'Confirmação incorreta'),
        });

        await schema.validate(data, {
          abortEarly: false, // Para nao parar no primeiro erro
        });

        // Desestruturando para ficar mais facil
        const {
          name,
          email,
          old_password,
          password,
          password_confirmation,
        } = data;

        // Para poder atualizar somente o nome e email. Se o old_password estiver preenchido, coloque o old_password, password e password_confirmation dentro do objeto formData e envie para atualizacao. Se nao estiver preenchido, deixa um obejto vazio, e vai enviar somente o nome e email
        const formData = {
          name,
          email,
          ...(old_password
            ? { old_password, password, password_confirmation }
            : []),
        };

        // Fazer atualização do usuario. Colocar o formData, vai enviar tudo ou so o name e email
        const response = await api.put('/profile', formData);

        // Atualizar as informacoes do usuario no hook de auth, ai a nova informacao vai estar disponivel em todo context, toda aplicacao
        updateUser(response.data);

        history.push('/dashboard');

        // Colocar o toast de sucesso
        addToast({
          type: 'success',
          title: `Perfil atualizado!`,
          description: `Suas informações do perfil foram atualizadas com sucesso!`,
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
          title: `Erro na atualização`,
          description: `Ocorreu um erro ao atualizar perfil, tente novamente.`,
        });
      }
    },
    [addToast, history, t, updateUser],
  );

  const handleAvatarChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      // O Multipart do Insomnia eh representado no javascript pela classe FormData.

      // Ver a imagem que foi selecionada
      if (e.target.files) {
        const data = new FormData();

        // O nome do campo input, e pegar o valor da imagem selecionada.
        data.append('avatar', e.target.files[0]);

        api.patch('/users/avatar', data).then((response) => {
          // Assim que receber a resposta que foi atualizado. Atualize os dados do usuario no hooks de auth, incluindo a foto.
          updateUser(response.data);

          addToast({
            type: 'success',
            title: 'Avatar atualizado',
          });
        });
      }
    },
    [addToast, updateUser],
  );

  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>

      <Content>
        <Form
          ref={formRef}
          initialData={{
            name: user.name,
            email: user.email,
          }}
          onSubmit={handleSubmit}
        >
          <AvatarInput>
            <img src={user.avatar_url} alt={user.name} />

            <label htmlFor="avatar">
              <FiCamera />

              <input
                type="file"
                id="avatar"
                onChange={handleAvatarChange}
                data-testid="input-file"
              />
            </label>
          </AvatarInput>

          <h1>Meu Perfil</h1>

          <Input
            name="name"
            icon={FiUser}
            placeholder="Nome"
            data-testid="nameField"
          />

          <Input
            name="email"
            icon={FiMail}
            placeholder="Email"
            data-testid="emailField"
          />

          <Input
            containerStyle={{ marginTop: 24 }}
            name="old_password"
            icon={FiLock}
            type="password"
            placeholder="Senha atual"
            data-testid="oldPasswordField"
          />

          <Input
            name="password"
            icon={FiLock}
            type="password"
            placeholder="Nova senha"
            data-testid="passwordField"
          />

          <Input
            name="password_confirmation"
            icon={FiLock}
            type="password"
            placeholder="Confirmar senha"
            data-testid="passwordConfirmationField"
          />

          <Button type="submit" data-testid="buttonSubmit">
            Confirmar mudanças
          </Button>
        </Form>
      </Content>
    </Container>
  );
};

export default Profile;
