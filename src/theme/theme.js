import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1d4ed8',
      dark: '#0b1a4a',
      light: '#5b7cfa',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#d2691e',
      dark: '#9a4a12',
      light: '#f2a765',
      contrastText: '#0b1a4a',
    },
    background: {
      default: '#eef2f7',
      paper: '#ffffff',
    },
    text: {
      primary: '#0b1a4a',
      secondary: '#4b5565',
    },
    divider: 'rgba(11, 26, 74, 0.12)',
  },
  typography: {
    fontFamily: '"Manrope", "Segoe UI", "Helvetica Neue", sans-serif',
    h1: { fontWeight: 800 },
    h2: { fontWeight: 800 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    subtitle1: { fontWeight: 600 },
    button: { fontWeight: 700, textTransform: 'none' },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#eef2f7',
          backgroundImage:
            'radial-gradient(1000px 500px at 0% 0%, rgba(29, 78, 216, 0.08), transparent 60%), radial-gradient(900px 500px at 100% 0%, rgba(210, 105, 30, 0.12), transparent 60%)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(11, 26, 74, 0.08)',
          boxShadow: '0 12px 30px rgba(11, 26, 74, 0.08)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          paddingInline: 18,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, #0b1a4a 0%, #122a7a 60%, #1d4ed8 100%)',
          color: '#ffffff',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: '#0b1a4a',
          color: '#e5edff',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          marginInline: 8,
          '&.Mui-selected': {
            backgroundColor: 'rgba(255, 255, 255, 0.14)',
            color: '#ffffff',
          },
          '&.Mui-selected:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.22)',
          },
        },
      },
    },
  },
});

export default theme;