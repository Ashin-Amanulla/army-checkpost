import { createContext, useContext, useState } from 'react';
import { defaultTheme } from '../styles/theme';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(defaultTheme);

  const updateTheme = (updates) => {
    setTheme(prevTheme => ({
      ...prevTheme,
      ...updates
    }));
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext); 