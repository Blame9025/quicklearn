import {
  Switch,
  Button,
  UnstyledButton,
  Badge,
  Modal,
  Text,
  Group,
  ActionIcon,
  Tooltip,
  Stack,
  ScrollArea,
  CheckIcon,
  Combobox, 
  Input, 
  InputBase,
  useCombobox,
  rem,
  useMantineColorScheme,

} from '@mantine/core';
import {useState,useEffect} from "react";
import { useDisclosure } from '@mantine/hooks';
import { IconBulb, IconUser, IconCheckbox, IconSearch, IconPlus,IconSettings } from '@tabler/icons-react';
import { UserButton } from '../UserButton/UserButton';
import classes from './Nav.module.css';
import { useTranslation } from 'react-i18next'


const links = [
  { icon: IconBulb, label: 'Activity', notifications: 3 },
  { icon: IconCheckbox, label: 'Tasks', notifications: 4 },
  { icon: IconUser, label: 'Contacts' },
];

const collections = [
  { emoji: '👍', label: 'Sales' },
  { emoji: '🚚', label: 'Deliveries' },
  { emoji: '💸', label: 'Discounts' },
  

];

export function Nav() {
  const {t ,i18n} = useTranslation();
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: (eventSource) => {
      if (eventSource === 'keyboard') {
        combobox.selectActiveOption();
      } else {
        combobox.updateSelectedOptionIndex('active');
      }
    },
  });

  const [language, setLanguage] = useState<string | null>('🇷🇴 ROMANA');

  const collectionLinks = collections.map((collection) => (
    <a
      href="#"
      onClick={(event) => event.preventDefault()}
      key={collection.label}
      className={classes.collectionLink}
    >
      <span style={{ marginRight: rem(9), fontSize: rem(16) }}>{collection.emoji}</span>{' '}
      {collection.label}
    </a>
  ));
  const languages: { [key: string]: string } = {
    ["ro"]: "🇷🇴 ROMANA",
    ["en"]: "🇺🇸 ENGLEZA"
  };

  const comboboxOptions = Object.keys(languages).map((index) => (
    <Combobox.Option value={index} key={index} active={index === language}>
      <Group gap="xs">
        {index === language && <CheckIcon size={12} />}
        <span>{languages[index]}</span>
      </Group>
    </Combobox.Option>
  ));
  console.log(language);
  const [settingsOpened, { open, close }] = useDisclosure(false);
  const [ darkTheme, setDarkTheme ] = useState(localStorage.getItem('darkTheme') === 'true');
  const { setColorScheme } = useMantineColorScheme({
    keepTransitions: true
  })
  useEffect(() => {
    setColorScheme(darkTheme ? "dark" : "light")
    localStorage.setItem('darkTheme', darkTheme.toString());
  }, [darkTheme]);
  return (
    <>
      <nav className={classes.navbar}>
        <div className={classes.section}>
          <UserButton />
        </div>

      
        <div className={classes.section}>
          <Group className={classes.collectionsHeader} justify="space-between">
            <Text size="xs" fw={500} c="dimmed">
              Collections
            </Text>
            <Tooltip label="Create collection" withArrow position="right">
              <ActionIcon variant="default" size={18}>
                <IconPlus style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
              </ActionIcon>
            </Tooltip>
          </Group>
          <ScrollArea className={classes.scrollbar}>
            <div className={classes.collections}>{collectionLinks}</div>
          </ScrollArea>
        </div>

        <div className={classes.sectionFooter} >
            <Group className={classes.footer}>
              <Button  leftSection = {<IconSettings />} variant="default" fullWidth onClick={open} className={classes.footerButton}>Settings {settingsOpened} </Button>
              <Button variant = "light" color = "red" fullWidth className={classes.footerButton}>Logout</Button>
            </Group>
            
        </div>
      </nav>
      <Modal opened={settingsOpened} onClose={close} title="Settings" size="xl" className = {classes.modal} centered>
        <Stack
          h={200}
          bg="var(--mantine-color-body)"
        >
            <Switch
              label="Dark mode"
              onLabel="ON" 
              checked={darkTheme}
              onChange={(event) => {
                setDarkTheme(event.currentTarget.checked)
                //
              }}

              offLabel="OFF"
              onClick={() => {

              }}
            />
            <Combobox
              store={combobox}
              resetSelectionOnOptionHover
              withinPortal={false}
              onOptionSubmit={(val) => {
                setLanguage(val);
                combobox.updateSelectedOptionIndex('active');
                i18n.changeLanguage(val)
                localStorage.setItem("language",val)
              }}
            >
              <Combobox.Target targetType="button">
                <InputBase
                  component="button"
                  type="button"
                  pointer
                  rightSection={<Combobox.Chevron />}
                  rightSectionPointerEvents="none"
                  onClick={() => combobox.toggleDropdown()}
                >
                  {languages[language || ""] || <Input.Placeholder>Pick your language</Input.Placeholder>}
                </InputBase>
              </Combobox.Target>

              <Combobox.Dropdown>
                <Combobox.Options>{comboboxOptions}</Combobox.Options>
              </Combobox.Dropdown>
            </Combobox>
        </Stack>
      </Modal>
    </>
  );
}