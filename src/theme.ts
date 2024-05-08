import { createTheme,ActionIcon } from '@mantine/core';
import navClasses from './components/Nav/Nav.module.css';

export const theme = createTheme({
  components: {
    ActionIcon: ActionIcon.extend({
      classNames: navClasses,
    }),
  },
});
