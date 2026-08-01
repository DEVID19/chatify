import { useState, useEffect } from "react";

const STORAGE_KEY = "chatify-theme";

export const useTheme = () => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem(STORAGE_KEY) || "dark"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((t) => (t === "dark" ? "light" : "dark"));

  return { theme, toggleTheme };
};

export default useTheme;
