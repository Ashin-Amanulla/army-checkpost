export const defaultTheme = {
  colors: {
    primary: {
      light: '#f0fdf4',    // green-50
      main: '#16a34a',     // green-600
      dark: '#15803d',     // green-700
      text: '#ffffff'      // white
    },
    secondary: {
      light: '#f8fafc',    // slate-50
      main: '#64748b',     // slate-500
      dark: '#475569',     // slate-600
      text: '#ffffff'
    },
    military: {
      olive: {
        light: '#4B5320',
        main: '#3D441B',
        dark: '#2F3314'
      },
      desert: {
        light: '#D4B996',
        main: '#C19A6B',
        dark: '#A67F5D'
      },
      navy: {
        light: '#1E3D59',
        main: '#17314A',
        dark: '#11253B'
      },
      camo: {
        light: '#78866B',
        main: '#606B51',
        dark: '#4A513E'
      }
    },
    text: {
      primary: '#111827',   // gray-900
      secondary: '#4b5563', // gray-600
      disabled: '#9ca3af'   // gray-400
    },
    background: {
      default: '#f3f4f6',   // gray-100
      paper: '#ffffff'
    },
    border: {
      light: '#e5e7eb',     // gray-200
      main: '#d1d5db'       // gray-300
    }
  },
  typography: {
    fontFamily: {
      primary: 'Inter, system-ui, sans-serif',
      military: 'Roboto Mono, monospace'
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem'
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem'
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    full: '9999px'
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
  }
}; 