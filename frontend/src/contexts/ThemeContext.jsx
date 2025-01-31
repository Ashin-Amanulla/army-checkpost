import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const theme = {
    primary: '#16a34a', // green-600
    secondary: '#374151', // gray-700
    background: '#f3f4f6', // gray-100
    text: '#111827', // gray-900
  };

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
