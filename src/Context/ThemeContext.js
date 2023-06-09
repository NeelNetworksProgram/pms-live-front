import { createContext, useEffect, useState } from "react";

export const ContextTheme = createContext();

export const ThemeContext = ({ children }) => {
  const [toggleTheme, setToggleTheme] = useState("");
  // handling theme
  const handleTheme = () => {
    setToggleTheme((prev) => !prev);
  };

  // NEED TO GET THEME FROM LOCALSTORAGE & SET IN LOCALSTORAGE
  // ----- need to try this
  // const handleTheme = (themeType) => {
  //   if (themeType === "dark") {
  //     setToggleTheme(() => true);
  //   } else {
  //     setToggleTheme(() => false);
  //   }
  // };

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    setToggleTheme(theme);
  }, []);

  return (
    <ContextTheme.Provider value={{ handleTheme, toggleTheme }}>
      {children}
    </ContextTheme.Provider>
  );
};
