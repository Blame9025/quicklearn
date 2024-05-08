import '@mantine/core/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/notifications/styles.css';
import 'mantine-contextmenu/styles.layer.css';
import { ContextMenuProvider } from 'mantine-contextmenu';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { Router } from './Router';
import { theme } from './theme';
import { useEffect,useState } from 'react';
import { useTranslation } from 'react-i18next';
export default function App() {
  const {i18n} = useTranslation()
  const [isPageLoaded, setIsPageLoaded] = useState(false); 

  useEffect(() => {
    if(!isPageLoaded){
      const language = localStorage.getItem("language");
      if(language)
      {
        i18n.changeLanguage(language)
        setIsPageLoaded(true)
      }
    }

  })
  return (
    <>

      <MantineProvider theme={theme}>
        <ContextMenuProvider>
          <Notifications />
          <Router />
        </ContextMenuProvider>
      </MantineProvider>

    </>
  );
}
