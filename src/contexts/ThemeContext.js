"use client";

import { createContext, useContext } from "react";

const theme = {
    primary: "#000000",
    secondary: "#1e90ff",
    textColor: "#ffffff",
    grayText: "#A7A3A3",
    error: "#ff4d4f",
    background: "#000000",
    border: "1px solid #333333",
    btnBackground: "#fff",
    btnText: "#000000",
    radius: "8px",
    cardBackground: "#1c1b1b"
};

const ThemeContext = createContext(theme);

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};