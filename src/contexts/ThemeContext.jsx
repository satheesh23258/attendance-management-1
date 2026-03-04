import React, { createContext, useContext, useMemo } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'

const ThemeContext = createContext()

// Default theme for fallback
const defaultTheme = {
  theme: createTheme({
    palette: {
      primary: { main: '#00c853', light: '#5efc82', dark: '#009624', contrastText: '#ffffff' },
      secondary: { main: '#000000', light: '#333333', dark: '#000000', contrastText: '#ffffff' },
      background: { default: '#ffffff', paper: '#ffffff' },
      mode: 'light'
    }
  }),
  role: 'employee',
  colors: {
    primary: { main: '#00c853', light: '#5efc82', dark: '#009624', contrastText: '#ffffff' },
    secondary: { main: '#000000', light: '#333333', dark: '#000000', contrastText: '#ffffff' },
    background: { default: '#ffffff', paper: '#ffffff' },
    header: { main: '#ffffff', gradient: 'none' }
  }
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  return context || defaultTheme
}

// Strictly matching green, white, black scheme for all roles
const uniformRoleTheme = {
  primary: {
    main: '#00c853', // vibrant green
    light: '#5efc82',
    dark: '#009624',
    contrastText: '#ffffff'
  },
  secondary: {
    main: '#000000', // black
    light: '#333333',
    dark: '#000000',
    contrastText: '#ffffff'
  },
  background: {
    default: '#ffffff', // pure white background
    paper: '#ffffff' // pure white paper
  },
  header: {
    main: '#ffffff',
    gradient: 'none' // remove gradients
  }
}

const roleThemes = {
  admin: uniformRoleTheme,
  hr: uniformRoleTheme,
  employee: uniformRoleTheme,
  hybrid: uniformRoleTheme
}

export const RoleThemeProvider = ({ children, role }) => {
  const theme = useMemo(() => {
    const roleTheme = roleThemes[role] || roleThemes.employee

    // Minimal theme to avoid MUI conflicts
    return createTheme({
      palette: {
        primary: roleTheme.primary,
        secondary: roleTheme.secondary,
        background: roleTheme.background,
        mode: 'light'
      },
      typography: {
        fontFamily: '"Outfit", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h4: {
          fontWeight: 700,
          fontSize: '2rem',
          lineHeight: 1.2,
          letterSpacing: '-0.02em'
        },
        h5: {
          fontWeight: 600,
          fontSize: '1.5rem',
          letterSpacing: '-0.01em'
        },
        h6: {
          fontWeight: 600,
          fontSize: '1.15rem',
          lineHeight: 1.4,
          letterSpacing: '-0.01em'
        },
        body1: {
          fontWeight: 400,
          fontSize: '0.95rem',
          lineHeight: 1.6
        },
        button: {
          fontWeight: 600,
          textTransform: 'none',
        }
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              backgroundColor: '#f4f7f9',
              transition: 'all 0.3s ease-in-out',
            },
            '*::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '*::-webkit-scrollbar-track': {
              background: '#f1f1f1',
              borderRadius: '10px',
            },
            '*::-webkit-scrollbar-thumb': {
              background: '#c1c1c1',
              borderRadius: '10px',
            },
            '*::-webkit-scrollbar-thumb:hover': {
              background: '#a8a8a8',
            },
          }
        },
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: 'none',
              borderRadius: 12,
              fontWeight: 600,
              padding: '10px 24px',
              fontSize: '0.95rem',
              background: 'transparent',
              color: '#000000',
              border: '2px solid #00c853',
              boxShadow: 'none',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                background: 'rgba(0, 200, 83, 0.1)',
              },
              '&:active': {
                transform: 'translateY(0)',
              }
            },
            contained: {
              background: 'transparent',
              color: '#000000',
              border: '2px solid #000000',
              boxShadow: 'none',
              '&:hover': {
                background: 'rgba(0, 0, 0, 0.05)',
              }
            }
          }
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 20,
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              border: '1px solid rgba(255,255,255,1)',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 28px rgba(0,0,0,0.08)',
              }
            }
          }
        },
        MuiPaper: {
          styleOverrides: {
            vertical: {
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
            },
            rounded: {
              borderRadius: 20,
            }
          }
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              '& .MuiOutlinedInput-root': {
                borderRadius: 14,
                backgroundColor: '#f8fafc',
                transition: 'all 0.2s ease',
                '& fieldset': {
                  borderColor: '#e2e8f0',
                  borderWidth: '1.5px',
                },
                '&:hover fieldset': {
                  borderColor: roleTheme.primary.light,
                },
                '&.Mui-focused fieldset': {
                  borderColor: roleTheme.primary.main,
                  borderWidth: '2px',
                },
                '&.Mui-focused': {
                  backgroundColor: '#ffffff',
                  boxShadow: `0 0 0 4px ${roleTheme.primary.main}1A`,
                }
              }
            }
          }
        },
        MuiTableCell: {
          styleOverrides: {
            root: {
              borderBottom: '1px solid #f1f5f9',
              padding: '16px',
            },
            head: {
              backgroundColor: '#f8fafc',
              fontWeight: 700,
              color: '#334155',
              borderBottom: '2px solid #e2e8f0',
              textTransform: 'uppercase',
              fontSize: '0.75rem',
              letterSpacing: '0.05em',
            }
          }
        },
        MuiAvatar: {
          styleOverrides: {
            root: {
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              border: '2px solid #00c853',
              background: '#ffffff',
              color: '#000000'
            }
          }
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
              borderBottom: '2px solid #000000',
              background: '#ffffff',
              color: '#000000'
            }
          }
        },
        MuiTypography: {
          styleOverrides: {
             root: {
                color: '#000000'
             }
          }
        }
      }
    })
  }, [role])

  return (
    <ThemeContext.Provider value={{ theme, role, colors: roleThemes[role] || roleThemes.employee }}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  )
}

export default RoleThemeProvider
