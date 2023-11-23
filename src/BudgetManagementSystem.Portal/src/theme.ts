// theme.ts
import { createTheme } from '@mui/material/styles';

// Define your custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3', // Set your primary color
    },
    secondary: {
      main: '#01579b', // Set your secondary color
    },
    error: {
      main: '#c62828', // Set your error color
    },
    background: {
      default: '#f5f5f5', // Set your default background color
    },
    warning: {
      main: '#ff9800',
    }
  },
  typography: {
    fontFamily: "'Poppins', sans-serif", // Set your preferred font
    button: {
        textTransform: 'none', // Set text-transform to 'none' to preserve case
        fontWeight: 500, // Set font weight as needed
      },
  },
});

export default theme;
