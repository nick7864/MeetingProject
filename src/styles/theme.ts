import { createTheme, alpha } from '@mui/material/styles';

// ===== Color Palette: Command Center Industrial =====
const colors = {
  // Primary - Deep Teal
  teal: {
    50: '#E6F5F5',
    100: '#B3E0E0',
    200: '#80CBCB',
    300: '#4DB6B6',
    400: '#26A1A1',
    500: '#0D7377', // Main
    600: '#0A5C5F',
    700: '#074547',
    800: '#042E2F',
    900: '#021717',
  },
  // Accent - Warm Amber
  amber: {
    50: '#FEF8EE',
    100: '#FCECD3',
    200: '#F9DFA9',
    300: '#F6D27F',
    400: '#F3C555',
    500: '#DD9F4B', // Main
    600: '#B88034',
    700: '#8A6027',
    800: '#5C401A',
    900: '#2E200D',
  },
  // Neutral - Warm Gray
  gray: {
    50: '#FAFAF9',
    100: '#F5F4F2',
    200: '#E8E7E3',
    300: '#D4D2CC',
    400: '#A8A59E',
    500: '#78746C',
    600: '#5C5850',
    700: '#3D3A34',
    800: '#26241F',
    900: '#17150F',
  },
  // Status Colors
  success: {
    light: '#E8F5ED',
    main: '#4A9B7F',
    dark: '#3A7A64',
  },
  warning: {
    light: '#FEF7EC',
    main: '#DD9F4B',
    dark: '#B88034',
  },
  error: {
    light: '#FDEEEB',
    main: '#E05A47',
    dark: '#C44A38',
  },
  info: {
    light: '#E6F5F5',
    main: '#0D7377',
    dark: '#0A5C5F',
  },
};

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: colors.teal[500],
      light: colors.teal[300],
      dark: colors.teal[700],
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: colors.amber[500],
      light: colors.amber[300],
      dark: colors.amber[700],
      contrastText: '#FFFFFF',
    },
    error: {
      main: colors.error.main,
      light: colors.error.light,
      dark: colors.error.dark,
    },
    warning: {
      main: colors.warning.main,
      light: colors.warning.light,
      dark: colors.warning.dark,
    },
    success: {
      main: colors.success.main,
      light: colors.success.light,
      dark: colors.success.dark,
    },
    info: {
      main: colors.info.main,
      light: colors.info.light,
      dark: colors.info.dark,
    },
    background: {
      default: colors.gray[100],
      paper: '#FFFFFF',
    },
    text: {
      primary: colors.gray[800],
      secondary: colors.gray[500],
      disabled: colors.gray[400],
    },
    divider: colors.gray[200],
    grey: colors.gray,
  },

  typography: {
    fontFamily: '"IBM Plex Sans TC", "Source Sans 3", sans-serif',
    // Headings
    h1: {
      fontFamily: '"Source Sans 3", sans-serif',
      fontWeight: 800,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
      color: colors.gray[900],
    },
    h2: {
      fontFamily: '"Source Sans 3", sans-serif',
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
      color: colors.gray[800],
    },
    h3: {
      fontFamily: '"Source Sans 3", sans-serif',
      fontWeight: 700,
      fontSize: '1.5rem',
      lineHeight: 1.4,
      color: colors.gray[800],
    },
    h4: {
      fontFamily: '"Source Sans 3", sans-serif',
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
      color: colors.gray[700],
    },
    h5: {
      fontFamily: '"Source Sans 3", sans-serif',
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.5,
      color: colors.gray[700],
    },
    h6: {
      fontFamily: '"IBM Plex Sans TC", sans-serif',
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.5,
      color: colors.gray[700],
    },
    // Body
    body1: {
      fontFamily: '"IBM Plex Sans TC", sans-serif',
      fontWeight: 400,
      fontSize: '0.9375rem',
      lineHeight: 1.6,
      color: colors.gray[700],
    },
    body2: {
      fontFamily: '"IBM Plex Sans TC", sans-serif',
      fontWeight: 400,
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: colors.gray[600],
    },
    // Small text
    caption: {
      fontFamily: '"IBM Plex Sans TC", sans-serif',
      fontWeight: 400,
      fontSize: '0.75rem',
      lineHeight: 1.4,
      color: colors.gray[500],
      letterSpacing: '0.02em',
    },
    // Labels & Buttons
    button: {
      fontFamily: '"IBM Plex Sans TC", sans-serif',
      fontWeight: 500,
      fontSize: '0.875rem',
      textTransform: 'none',
      letterSpacing: '0.01em',
    },
    subtitle1: {
      fontFamily: '"IBM Plex Sans TC", sans-serif',
      fontWeight: 500,
      fontSize: '1rem',
      lineHeight: 1.5,
      color: colors.gray[700],
    },
    subtitle2: {
      fontFamily: '"IBM Plex Sans TC", sans-serif',
      fontWeight: 500,
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: colors.gray[600],
    },
  },

  shape: {
    borderRadius: 8,
  },

  shadows: [
    'none',
    `0 1px 2px ${alpha(colors.gray[900], 0.04)}`,
    `0 1px 3px ${alpha(colors.gray[900], 0.06)}, 0 1px 2px ${alpha(colors.gray[900], 0.04)}`,
    `0 4px 6px ${alpha(colors.gray[900], 0.04)}, 0 2px 4px ${alpha(colors.gray[900], 0.06)}`,
    `0 6px 12px ${alpha(colors.gray[900], 0.06)}, 0 4px 8px ${alpha(colors.gray[900], 0.04)}`,
    `0 10px 20px ${alpha(colors.gray[900], 0.08)}, 0 6px 12px ${alpha(colors.gray[900], 0.06)}`,
    `0 14px 28px ${alpha(colors.gray[900], 0.08)}, 0 10px 16px ${alpha(colors.gray[900], 0.06)}`,
    `0 20px 40px ${alpha(colors.gray[900], 0.1)}, 0 14px 28px ${alpha(colors.gray[900], 0.08)}`,
    `0 24px 48px ${alpha(colors.gray[900], 0.12)}`,
    `0 28px 56px ${alpha(colors.gray[900], 0.14)}`,
    `0 32px 64px ${alpha(colors.gray[900], 0.16)}`,
    `0 36px 72px ${alpha(colors.gray[900], 0.18)}`,
    `0 40px 80px ${alpha(colors.gray[900], 0.2)}`,
    `0 44px 88px ${alpha(colors.gray[900], 0.22)}`,
    `0 48px 96px ${alpha(colors.gray[900], 0.24)}`,
    `0 52px 104px ${alpha(colors.gray[900], 0.26)}`,
    `0 56px 112px ${alpha(colors.gray[900], 0.28)}`,
    `0 60px 120px ${alpha(colors.gray[900], 0.3)}`,
    `0 64px 128px ${alpha(colors.gray[900], 0.32)}`,
    `0 68px 136px ${alpha(colors.gray[900], 0.34)}`,
    `0 72px 144px ${alpha(colors.gray[900], 0.36)}`,
    `0 76px 152px ${alpha(colors.gray[900], 0.38)}`,
    `0 80px 160px ${alpha(colors.gray[900], 0.4)}`,
    `0 84px 168px ${alpha(colors.gray[900], 0.42)}`,
    `0 88px 176px ${alpha(colors.gray[900], 0.44)}`,
  ],

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: '"IBM Plex Sans TC", sans-serif',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          textRendering: 'optimizeLegibility',
        },
        // Smooth transitions for all interactive elements
        'button, a, input, [role="button"]': {
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: `0 1px 3px ${alpha(colors.gray[900], 0.06)}, 0 1px 2px ${alpha(colors.gray[900], 0.04)}`,
          borderRadius: 12,
          border: `1px solid ${colors.gray[200]}`,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: `0 6px 16px ${alpha(colors.gray[900], 0.08)}, 0 3px 6px ${alpha(colors.gray[900], 0.04)}`,
            borderColor: colors.gray[300],
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: `0 1px 3px ${alpha(colors.gray[900], 0.06)}`,
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8,
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          background: `linear-gradient(135deg, ${colors.teal[500]} 0%, ${colors.teal[600]} 100%)`,
          '&:hover': {
            background: `linear-gradient(135deg, ${colors.teal[400]} 0%, ${colors.teal[500]} 100%)`,
          },
          '&:active': {
            background: colors.teal[700],
          },
        },
        containedSecondary: {
          background: `linear-gradient(135deg, ${colors.amber[500]} 0%, ${colors.amber[600]} 100%)`,
          '&:hover': {
            background: `linear-gradient(135deg, ${colors.amber[400]} 0%, ${colors.amber[500]} 100%)`,
          },
        },
        outlined: {
          borderWidth: 1.5,
          '&:hover': {
            borderWidth: 1.5,
          },
        },
        outlinedPrimary: {
          borderColor: alpha(colors.teal[500], 0.5),
          '&:hover': {
            borderColor: colors.teal[500],
            backgroundColor: alpha(colors.teal[500], 0.04),
          },
        },
      },
      defaultProps: {
        disableElevation: true,
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
          fontSize: '0.75rem',
          height: 24,
        },
        colorPrimary: {
          backgroundColor: alpha(colors.teal[500], 0.12),
          color: colors.teal[700],
          '&:hover': {
            backgroundColor: alpha(colors.teal[500], 0.2),
          },
        },
        colorSecondary: {
          backgroundColor: alpha(colors.amber[500], 0.12),
          color: colors.amber[700],
        },
        colorError: {
          backgroundColor: colors.error.light,
          color: colors.error.dark,
        },
        colorSuccess: {
          backgroundColor: colors.success.light,
          color: colors.success.dark,
        },
        colorWarning: {
          backgroundColor: colors.warning.light,
          color: colors.warning.dark,
        }
        // colorDefault: {
        //   backgroundColor: colors.gray[100],
        //   color: colors.gray[600],
        // },
      },
    },

    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
        colorDefault: {
          backgroundColor: colors.teal[100],
          color: colors.teal[700],
        },
      },
    },

    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          backgroundColor: colors.gray[200],
        },
        bar: {
          borderRadius: 6,
          background: `linear-gradient(90deg, ${colors.teal[400]} 0%, ${colors.teal[500]} 100%)`,
        },
        // barColorSuccess: {
        //   background: `linear-gradient(90deg, ${colors.success.light} 0%, ${colors.success.main} 100%)`,
        // },
        // barColorWarning: {
        //   background: `linear-gradient(90deg, ${colors.warning.light} 0%, ${colors.warning.main} 100%)`,
        // },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: `1px solid ${colors.gray[200]}`,
          backgroundColor: colors.gray[50],
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '2px 8px',
          '&.Mui-selected': {
            backgroundColor: alpha(colors.teal[500], 0.08),
            '&:hover': {
              backgroundColor: alpha(colors.teal[500], 0.12),
            },
          },
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: colors.gray[200],
          fontSize: '0.875rem',
        },
        head: {
          fontWeight: 600,
          backgroundColor: colors.gray[50],
          color: colors.gray[700],
        },
      },
    },

    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: alpha(colors.teal[500], 0.02),
          },
          '&:last-child td': {
            borderBottom: 0,
          },
        },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.9rem',
          minWidth: 'auto',
          padding: '12px 16px',
          '&.Mui-selected': {
            fontWeight: 600,
          },
        },
      },
    },

    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderRadius: '3px 3px 0 0',
        },
      },
    },

    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 500,
        },
        standardError: {
          backgroundColor: colors.error.light,
          color: colors.error.dark,
        },
        standardWarning: {
          backgroundColor: colors.warning.light,
          color: colors.warning.dark,
        },
        standardSuccess: {
          backgroundColor: colors.success.light,
          color: colors.success.dark,
        },
        standardInfo: {
          backgroundColor: colors.info.light,
          color: colors.info.dark,
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: colors.gray[800],
          fontSize: '0.75rem',
          borderRadius: 6,
          padding: '6px 12px',
        },
        arrow: {
          color: colors.gray[800],
        },
      },
    },

    MuiBadge: {
      styleOverrides: {
        badge: {
          fontWeight: 600,
          fontSize: '0.7rem',
          height: 20,
          minWidth: 20,
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: colors.gray[200],
        },
      },
    },
  },
});

// Export colors for use in components
export { colors };

// Custom alpha function for components
export const customAlpha = alpha;
