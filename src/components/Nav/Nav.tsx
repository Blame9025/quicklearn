import {
  Switch,
  Button,
  UnstyledButton,
  Title,
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
import { IconBulb, IconUser, IconCheckbox, IconLogout, IconPlus,IconSettings } from '@tabler/icons-react';
import { UserButton } from '../UserButton/UserButton';
import classes from './Nav.module.css';
import { useTranslation } from 'react-i18next'
import { getLanguage } from '../Language/Language';
import { WordIcon, PowerPointIcon } from "../CustomIcons/CustomIcons"

const documents = [
  {id: 1, file: "document1.pptx"},
  {id: 2, file: "document5.docx"},
  {id: 313, file: "document61.docx"},
  {id: 241, file: "document41.docx"},
  {id: 522, file: "document13.docx"},
  {id: 123132, file: "document166.docx"},


];

export function Nav() {
  const {t ,i18n} = useTranslation();
  const {languages, language, setLanguage} = getLanguage()
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
  const comboboxOptions = Object.keys(languages).map((index) => (
    <Combobox.Option value={index} key={index} active={index === language}>
        <Group gap="xs">
        {index === language && <CheckIcon size={12} />}
        <span>{languages[index]}</span>
        </Group>
    </Combobox.Option>
));
  const documentsComponents = documents.map((document) => (
    <a href="#" onClick={(event) => event.preventDefault()} key={document.id} className={classes.collectionLink}>
      <Group>
      {document.file.split(".")[1] == "docx" ? <WordIcon/> : <PowerPointIcon/>} {' '}
        
      {document.file}
      
      </Group>

    </a>
  ));

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
              {t("home_documents")}
            </Text>
            <Tooltip label={t("home_createDocumentTooltip")} withArrow position="right">
              <ActionIcon variant="default" size={18}>
                <IconPlus style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
              </ActionIcon>
            </Tooltip>
          </Group>
          <ScrollArea className={classes.scrollbar}>
            <div className={classes.collections}>{documentsComponents}</div>
          </ScrollArea>
        </div>

        <div className={classes.sectionFooter} >
            <Group className={classes.footer}>
              <Button  leftSection = {<IconSettings />} variant="default" fullWidth onClick={open} className={classes.footerButton}>{t("home_settings")}</Button>
              <Button  leftSection = {<IconLogout/>} variant = "light" color = "red" fullWidth className={classes.footerButton}>Logout</Button>
            </Group>
        </div>
      </nav>
      <Modal opened={settingsOpened} onClose={close} title={t("home_settings")} size="xl" className = {classes.modal} centered>
        <ScrollArea
          h={300}
        >
          <Stack>
              <Text>
                {t("home_settings_title_theme")}
              </Text>
              <Switch
                label={t("home_settings_darkmode")}
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
              <Text>
                {t("home_settings_title_language")}
              </Text>
              <Combobox
                store={combobox}
                resetSelectionOnOptionHover
                withinPortal={false}
                onOptionSubmit={(val) => {
                  setLanguage(val);
                  combobox.updateSelectedOptionIndex('active');
                  
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
                    {languages[language || "ro"] || <Input.Placeholder>{t("home_settings_pickLanguage")}</Input.Placeholder>}
                  </InputBase>
                </Combobox.Target>

                <Combobox.Dropdown>
                  <Combobox.Options>{comboboxOptions}</Combobox.Options>
                </Combobox.Dropdown>
              </Combobox>
            </Stack>
        </ScrollArea>
      </Modal>
    </>
  );
}