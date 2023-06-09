import React, { useContext } from "react";
import { ContextTheme } from "../../Context/ThemeContext";
import "../../stylesheet/App.css";

export const PageFooter = () => {
  const { toggleTheme } = useContext(ContextTheme);
  return (
    <div className={`default__footer ${toggleTheme ? "dark" : ""}`}>
      <p
        className={`${
          toggleTheme ? "dark-sub-text-color" : "default-text-color"
        }`}
      >
        Copyright © Neel Networks. All Rights Reserved.
      </p>
    </div>
  );
};
