import {useState} from "react"
import { UnstyledButton,Button, Group, Avatar, Text, rem, Stack } from '@mantine/core';
import { IconChevronRight,IconX, IconSettings } from '@tabler/icons-react';
import classes from './UserButton.module.css';
import { getTokenData } from '@/data';
export function UserButton() {
  const [open, setOpen] = useState(false);

  function handleUserDropdown(event: React.MouseEvent<HTMLButtonElement>) {
    setOpen(!open);
  }

  const userData = getTokenData("token");
  const {name, email} = userData as {name: string, email: string};
  return (
    <>

      <Group className={classes.user}>
        <Avatar
          radius="xl"
          color = "blue"
        >
          {name ? name.split(" ")[0][0]  + name.split(" ")[1][0] : "UNKNWON" }
        </Avatar>

        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            {name ? name : "UNKNWON"}
          </Text>

          <Text c="dimmed" size="xs">
            {email ? email : "UNKNWON"}
          </Text>
        </div>

      
      </Group>

    </>
  );
}