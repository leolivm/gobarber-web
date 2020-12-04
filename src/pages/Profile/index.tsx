import React, { useRef, useCallback, useState } from "react";
import { FiMail, FiLock, FiUser, FiCamera, FiArrowLeft } from "react-icons/fi";
import { Form } from "@unform/web";
import { Link, useHistory } from "react-router-dom";
import { FormHandles } from "@unform/core";
import * as Yup from "yup";
import { useAuth } from "../../hooks/auth";
import { useToast } from "../../hooks/toast";
import { Container, Content, AvatarInput } from "./styles";
import getValidationErrors from "../../utils/getValidationErrors";
import Input from "../../components/Input";
import Button from "../../components/Button";

interface ProfileFormData {
  email: string;
  password: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { signIn, user } = useAuth();
  const { addToast } = useToast();
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      try {
        setLoading(true);
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required("E-mail obrigatório.")
            .email("Digite um e-mail válido."),
          password: Yup.string().required("Senha obrigatória."),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await signIn({ email: data.email, password: data.password });

        history.push("/dashboard");
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: "error",
          title: "Erro na autenticação!",
          description: "Ocorreu um erro ao fazer login, cheque as credenciais.",
        });
      } finally {
        setLoading(false);
      }
    },
    [signIn, history, addToast]
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
          <Form ref={formRef} initialData={{
            name: user.name,
            email: user.name
          }} onSubmit={handleSubmit}>
            <AvatarInput>
              <img src={user.avatar_url} alt={user.name}/>
              <button type="button">
                <FiCamera />
              </button>
            </AvatarInput>
            <h1>Meu perfil</h1>


            <Input name="name" icon={FiUser} placeholder="Nome" />
            <Input name="email" icon={FiMail} placeholder="E-mail" />

            <Input
              containerStyle={{ marginTop: 24 }}
              name="old_password"
              icon={FiLock}
              type="password"
              placeholder="Senha atual"
            />

            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Senha"
            />

            <Input
              name="password_confirmation"
              icon={FiLock}
              type="password"
              placeholder="Confirmar senha"
            />

            <Button loading={loading} type="submit">
              Confirmar mudanças
            </Button>
          </Form>
      </Content>

    </Container>
  );
};

export default Profile;
