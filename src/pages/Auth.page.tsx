import { useToggle, upperFirst } from '@mantine/hooks';
import { useForm } from '@mantine/form';
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

export function Auth(props: PaperProps) {
  const [type, toggle] = useToggle(['login', 'register']);
  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
      terms: true,
    },

    validate: {
      email: (val: string) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val: string) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
    },
  });

  return (

    <Container size={500} my={250} mx = {100}>
        <Paper radius="md" p="xl" withBorder {...props}>
       
        <Group grow>
            <GoogleButton radius="l">Google</GoogleButton>
            <GithubButton radius="l">Github</GithubButton>
        </Group>

        <Divider label="Sau continua cu email" labelPosition="center" my="lg" />

        <form onSubmit={form.onSubmit(() => {})}>
            <Stack>
            {type === 'register' && (
                <TextInput
                label="Name"
                placeholder="Your name"
                value={form.values.name}
                onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
                radius="md"
                />
            )}

            <TextInput
                required
                label="Email"
                placeholder="exemplu@email.ro"
                value={form.values.email}
                onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
                error={form.errors.email && 'Invalid email'}
                radius="md"
            />

            <PasswordInput
                required
                label="Parola"
                placeholder="Parola dvs."
                value={form.values.password}
                onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
                error={form.errors.password && 'Password should include at least 6 characters'}
                radius="md"
            />

            {type === 'register' && (
                <Checkbox
                label="Accept termenii si conditiile de utilizare"
                checked={form.values.terms}
                onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
                />
            )}
            </Stack>

            <Group justify="space-between" mt="xl">
            <Anchor component="button" type="button" c="dimmed" onClick={() => toggle()} size="xs">
                {type === 'register'
                ? 'Ai deja cont? Login'
                : "Nu ai cont? Inregistreaza-te"}
            </Anchor>
            <Button type="submit" radius="xl">
                {upperFirst(type)}
            </Button>
            </Group>
        </form>
        </Paper>
    </Container>
  );
}