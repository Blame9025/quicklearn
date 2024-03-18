import {useState} from "react"
import { UnstyledButton,Button, Group, Avatar, Text, rem, Stack } from '@mantine/core';
import { IconChevronRight,IconX, IconSettings } from '@tabler/icons-react';
import classes from './UserButton.module.css';

export function UserButton() {
  const [open, setOpen] = useState(false);

  function handleUserDropdown(event: React.MouseEvent<HTMLButtonElement>) {
    setOpen(!open);
  }
  return (
    <>
      <UnstyledButton 
        className={classes.user}
      >
          <Group>
            <Avatar
              src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png"
              radius="xl"
            />

            <div style={{ flex: 1 }}>
              <Text size="sm" fw={500}>
                Neagu Razvan
              </Text>

              <Text c="dimmed" size="xs">
                razvan.neagu@cerna.ro
              </Text>
            </div>

          
          </Group>
      </UnstyledButton>
    </>
  );
}