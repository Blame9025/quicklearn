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
  Menu,

  useMantineColorScheme,

} from '@mantine/core';
import {useState,useEffect} from "react";
import { useDisclosure } from '@mantine/hooks';
import { IconBulb, IconUser, IconCheckbox, IconLogout, IconPlus,IconSettings,IconQuestionMark,IconTrash } from '@tabler/icons-react';
import { UserButton } from '../UserButton/UserButton';
import classes from './Nav.module.css';
import { useTranslation } from 'react-i18next'
import { getLanguage } from '../Language/Language';
import { WordIcon, PowerPointIcon } from "../CustomIcons/CustomIcons"
import { useSelector } from 'react-redux';
import { getTokenData } from '@/data';
import axiosHandler from '@/axios';
import {useNavigate} from "react-router-dom"
import { useContextMenu } from 'mantine-contextmenu';
export function Nav(props:any){
  const {t ,i18n} = useTranslation();
  const {languages, language, setLanguage} = getLanguage()
  const navigate = useNavigate()
  const { showContextMenu } = useContextMenu();
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
  async function logout()
  {
    console.log("logout")
    sessionStorage.clear()
    navigate("/auth")
  }
  const comboboxOptions = Object.keys(languages).map((index) => (
    <Combobox.Option value={index} key={index} active={index === language}>
        <Group gap="xs">
        {index === language && <CheckIcon size={12} />}
        <span>{languages[index]}</span>
        </Group>
    </Combobox.Option>
));
    const [opened, setOpened] = useState(false);
    const data = getTokenData("token") as {documents: {id: number, fileName: string}[]}
    const documentsComponents = data.documents.map((document) => (

        <a href="#"
          onContextMenu={showContextMenu([
            {
              key: 'copy',
              icon: <IconPlus size={16} />,
              title: 'Copy to clipboard',
              onClick: () => {}
            }
          
          ])}
          onClick={(event) => {
            
            event.preventDefault()
            props.onFileClick(document.id,document.fileName)
            setOpened(false)
          }
          }  className={classes.collectionLink}>
          <Group>
            {document.fileName.split(".")[document.fileName.split(".").length - 1] == "docx" ? <WordIcon/> : <PowerPointIcon/>} {' '}
              
            {document.fileName}
            
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
              <ActionIcon variant="danger" size={18}>
                <IconQuestionMark style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
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
              <Button  leftSection = {<IconLogout/>} variant = "light" color = "red" onClick={logout} fullWidth className={classes.footerButton}>Logout</Button>
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