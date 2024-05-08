import { useToggle, upperFirst } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { useNavigate } from "react-router-dom"
import { useTranslation } from 'react-i18next';
import { notifications } from '@mantine/notifications';
import classes from "./Auth.module.css"
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Container,
  Button,
  ButtonProps,
  Divider,
  Checkbox,
  Title,
  Anchor,
  Stack,
} from '@mantine/core';
import { GoogleButton, GithubButton } from '../components/SocialButtons/SocialButtons';
import axiosHandler from '../axios';

export function Auth(props: PaperProps) {
  const [type, toggle] = useToggle(['signin', 'signup']);
  const { t } = useTranslation();
  const navigate = useNavigate();

  async function handleOnSubmit(values: { email: string; password: string; name: string; terms: boolean} ){
    const response = await axiosHandler.post("/api/auth/"+type, values);
    if(response.data.code != "success")
      return notifications.show({
        title: t("auth_"+response.data.code+"_title"),
        message: t("auth_"+response.data.code+"_content"),
        color: "red",
      });
    sessionStorage.setItem("token", response.data.accessToken);
    navigate("/")
  }
  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
      terms: true,
    },

    validate: {
      email: (val: string) => (/^\S+@\S+$/.test(val) ? null : t("auth_register_invalidEmail")),
      password: (val: string) => (val.length <= 6 ? t("auth_register_invalidPassword") : null),
    },
  });

  return (
    <>
      
      <Container size={600} my={75}>
          <Paper radius="md" p="xl" withBorder {...props}>
            <Title className={classes.title} >
              QuickLearn
            </Title>
            <Divider my="lg" />
            <form onSubmit={form.onSubmit((values) => handleOnSubmit(values))}>
                <Stack>
                {type === 'signup' && (
                    <TextInput
                      label="Name"
                      placeholder={t("auth_register_namePlaceholder")}
                      value={form.values.name}
                      onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
                      radius="md"
                    />
                )}

                <TextInput
                    required
                    label="Email"
                    placeholder={t("auth_emailPlaceholder")}
                    value={form.values.email}
                    onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
                    error={form.errors.email && t("auth_register_invalidEmail")}
                    radius="md"
                />

                <PasswordInput
                    required
                    label={t("auth_passwordLabel")}
                    placeholder={t("auth_passwordPlaceholder")}
                    value={form.values.password}
                    onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
                    error={form.errors.password && t("auth_register_invalidPassword")}
                    radius="md"
                />

                {type === 'signup' && (
                    <Checkbox
                    label={t("auth_tos")}
                    checked={form.values.terms}
                    onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
                    />
                )}
                </Stack>

                <Group justify="space-between" mt="xl">
                <Anchor component="button" type="button" c="dimmed" onClick={() => toggle()} size="xs">
                    {type === 'signup'
                    ? t("auth_loginText")
                    : t("auth_registerText")}
                </Anchor>
                <Button type="submit" radius="xl">
                    {type == "signup" ? 
                    t("auth_register_buttonLabel") : t("auth_login_buttonLabel")}
                </Button>
                </Group>
            </form>
          </Paper>
      </Container>
    </>
  );
}