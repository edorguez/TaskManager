import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    tertiary: Palette['primary'];
    tertiaryContainer: string;
    primaryContainer: string;
    secondaryContainer: string;
    surfaceContainerLow: string;
    surfaceContainerHigh: string;
    surfaceContainerHighest: string;
    surfaceBright: string;
    surfaceContainerLowest: string;
    surfaceDim: string;
    outline: string;
    outlineVariant: string;
  }
  interface PaletteOptions {
    tertiary?: PaletteOptions['primary'];
    tertiaryContainer?: string;
    primaryContainer?: string;
    secondaryContainer?: string;
    surfaceContainerLow?: string;
    surfaceContainerHigh?: string;
    surfaceContainerHighest?: string;
    surfaceBright?: string;
    surfaceContainerLowest?: string;
    surfaceDim?: string;
    outline?: string;
    outlineVariant?: string;
  }
}

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#5e6300', contrastText: '#ffffff' },
    secondary: { main: '#006e27', contrastText: '#ffffff' },
    tertiary: { main: '#0054d6', contrastText: '#ffffff' },
    error: { main: '#ba1a1a', contrastText: '#ffffff' },
    background: { default: '#fbf9f1', paper: '#ffffff' },
    primaryContainer: '#f3ff00',
    secondaryContainer: '#00fe66',
    tertiaryContainer: '#f3f3ff',
    surfaceContainerLow: '#f5f4ec',
    surfaceContainerHigh: '#eae8e0',
    surfaceContainerHighest: '#e4e3db',
    surfaceBright: '#fbf9f1',
    surfaceContainerLowest: '#ffffff',
    surfaceDim: '#dcdad2',
    outline: '#78795f',
    outlineVariant: '#c8c8ab',
    text: { primary: '#1b1c17', secondary: '#474832' },
  },
  typography: {
    fontFamily: '"Space Grotesk", "Montserrat", sans-serif',
    h1: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 900,
      fontSize: '64px',
      lineHeight: 1.1,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 800,
      fontSize: '32px',
      lineHeight: 1.2,
    },
    h3: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 800,
      fontSize: '24px',
      lineHeight: 1.2,
    },
    h4: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 800,
      fontSize: '20px',
      lineHeight: 1.2,
    },
    h5: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 700,
      fontSize: '18px',
      lineHeight: 1.3,
    },
    h6: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 700,
      fontSize: '16px',
      lineHeight: 1.3,
    },
    body1: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 400,
      fontSize: '16px',
      lineHeight: 1.5,
    },
    body2: {
      fontFamily: '"Space Grotesk", sans-serif',
      fontWeight: 500,
      fontSize: '18px',
      lineHeight: 1.5,
    },
    subtitle1: {
      fontFamily: '"Space Mono", monospace',
      fontWeight: 700,
      fontSize: '14px',
      lineHeight: 1,
      letterSpacing: '0.05em',
    },
    caption: {
      fontFamily: '"Space Mono", monospace',
      fontWeight: 700,
      fontSize: '12px',
      lineHeight: 1,
      letterSpacing: '0.05em',
    },
    button: {
      fontFamily: '"Space Mono", monospace',
      fontWeight: 700,
      fontSize: '14px',
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
    },
  },
  shape: { borderRadius: 0 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#fbf9f1',
          color: '#1b1c17',
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: false },
      styleOverrides: {
        root: {
          border: '4px solid #1b1c17',
          borderRadius: 0,
          padding: '12px 24px',
          textTransform: 'uppercase',
          fontFamily: '"Space Mono", monospace',
          fontWeight: 700,
          fontSize: '14px',
          letterSpacing: '0.05em',
          transition: 'all 0.15s ease',
          boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
          backgroundColor: '#ffffff',
          color: '#1b1c17',
          '&:hover': {
            transform: 'translate(2px, 2px)',
            boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
          },
          '&:active': {
            transform: 'translate(4px, 4px)',
            boxShadow: '0px 0px 0px 0px rgba(0,0,0,1)',
          },
          '&.MuiButton-containedPrimary': {
            backgroundColor: '#f3ff00',
            color: '#6f7400',
            '&:hover': { backgroundColor: '#f3ff00' },
          },
          '&.MuiButton-containedSecondary': {
            backgroundColor: '#00fe66',
            color: '#007128',
            '&:hover': { backgroundColor: '#00fe66' },
          },
          '&.MuiButton-containedError': {
            backgroundColor: '#ba1a1a',
            color: '#ffffff',
            '&:hover': { backgroundColor: '#ba1a1a' },
          },
          '&.MuiButton-outlined': {
            backgroundColor: '#ffffff',
            color: '#1b1c17',
            border: '4px solid #1b1c17',
          },
          '&.MuiButton-text': {
            border: '2px solid transparent',
            boxShadow: 'none',
            '&:hover': {
              border: '2px solid #1b1c17',
              backgroundColor: 'transparent',
              boxShadow: '2px 2px 0px 0px rgba(0,0,0,1)',
            },
          },
        },
      },
      variants: [
        {
          props: { size: 'large' },
          style: {
            padding: '20px 32px',
            fontSize: '16px',
          },
        },
      ],
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '4px solid #1b1c17',
          borderRadius: 0,
          boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
          backgroundColor: '#ffffff',
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translate(2px, 2px)',
            boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          border: '4px solid #1b1c17',
          borderRadius: 0,
          boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            border: '4px solid #1b1c17',
            borderRadius: 0,
            backgroundColor: '#ffffff',
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: '16px',
            transition: 'all 0.2s ease',
            '& fieldset': { border: 'none' },
            '&:hover fieldset': { border: 'none' },
            '&.Mui-focused': {
              backgroundColor: '#f3ff00',
              boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
              transform: 'translate(-2px, -2px)',
            },
            '&.Mui-focused fieldset': { border: 'none' },
          },
          '& .MuiInputLabel-root': {
            fontFamily: '"Space Mono", monospace',
            fontWeight: 700,
            fontSize: '14px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: '#1b1c17',
            position: 'static',
            transform: 'none',
            marginBottom: '8px',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#1b1c17',
          },
          '& .MuiOutlinedInput-input': {
            padding: '16px',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          border: '2px solid #1b1c17',
          borderRadius: 0,
          fontFamily: '"Space Mono", monospace',
          fontWeight: 700,
          fontSize: '12px',
          textTransform: 'uppercase',
          height: 'auto',
          padding: '4px 12px',
          '&.MuiChip-filled': {
            backgroundColor: '#e4e3db',
            color: '#1b1c17',
          },
          '&.MuiChip-filledPrimary': {
            backgroundColor: '#0054d6',
            color: '#ffffff',
          },
          '&.MuiChip-filledSecondary': {
            backgroundColor: '#006e27',
            color: '#ffffff',
          },
          '&.MuiChip-filledError': {
            backgroundColor: '#ba1a1a',
            color: '#ffffff',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          border: 'none',
          backgroundColor: '#fbf9f1',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: '2px solid transparent',
          transition: 'all 0.15s ease',
          '&:hover': {
            border: '2px solid #1b1c17',
            backgroundColor: 'transparent',
            transform: 'translate(1px, 1px)',
            boxShadow: '2px 2px 0px 0px rgba(0,0,0,1)',
          },
        },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          border: '4px solid #1b1c17',
          borderRadius: 0,
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          border: 'none',
          borderRadius: 0,
          fontFamily: '"Space Mono", monospace',
          fontWeight: 700,
          fontSize: '14px',
          textTransform: 'uppercase',
          padding: '12px 24px',
          color: '#474832',
          backgroundColor: '#ffffff',
          '&.Mui-selected': {
            backgroundColor: '#00fe66',
            color: '#007128',
            boxShadow: '2px 2px 0px 0px rgba(0,0,0,1)',
            '&:hover': {
              backgroundColor: '#00fe66',
            },
          },
          '&:hover': {
            backgroundColor: '#e4e3db',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          border: '4px solid #1b1c17',
          borderRadius: 0,
          fontFamily: '"Space Grotesk", sans-serif',
          fontSize: '16px',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: '"Space Grotesk", sans-serif',
          fontSize: '16px',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          border: '4px solid #1b1c17',
          borderRadius: 0,
          fontFamily: '"Space Grotesk", sans-serif',
          '&.MuiAlert-filledError': {
            backgroundColor: '#ffdad6',
            color: '#93000a',
            border: '4px solid #1b1c17',
            boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
          },
          '&.MuiAlert-filledSuccess': {
            backgroundColor: '#6bff83',
            color: '#002107',
            border: '4px solid #1b1c17',
            boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
          },
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiPaper-root': {
            border: '4px solid #1b1c17',
            borderRadius: 0,
            boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)',
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#1b1c17',
          borderWidth: '4px',
        },
      },
    },
  },
});

export default theme;
