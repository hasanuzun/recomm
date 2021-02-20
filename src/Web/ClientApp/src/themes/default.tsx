import red from '@material-ui/core/colors/red';
import { createMuiTheme } from '@material-ui/core/styles';

// custom theme generator:  https://cimdalli.github.io/mui-theme-generator/
// A custom theme for this app
const defaultTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#bf360c',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
  },
  typography: {
      fontSize: 12
  }, 
  appDrawer: {
    width: 235
  },
  mixins: {
    toolbar: {
      height: 40
    }
  }
});

export default defaultTheme;