import { Container, Title, Text, Button, Group } from '@mantine/core';
import { Illustration } from '../components/404ilstruation/404ilstruation';
import classes from './NotFound.module.css';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
export function NotFound() {
  const { t } = useTranslation();
  return (
    <Container className={classes.root}>
      <div className={classes.inner}>
        <Illustration className={classes.image} />
        <div className={classes.content}>
          <Title className={classes.title}>{t("404notfound_title")}</Title>
          <Text c="dimmed" size="lg" ta="center" className={classes.description}>
          {t("404notfound_desc")}
          </Text>
          <Group justify="center">
            <Button size="md" component={Link} to="/">{t("404notfound_button")}</Button>
          </Group>
        </div>
      </div>
    </Container>
  );
}