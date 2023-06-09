// libraries
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import { ThemeContext, ContextTheme } from "./Context/ThemeContext";

// stylesheet
import "./stylesheet/index.css";

export { ContextTheme };

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0Provider
        domain="dev-l7qubcd01slydd5i.us.auth0.com"
        clientId="ogpJH5vjRq1EX6arr3IEP03vq5OzniMG"
        authorizationParams={{
          redirect_uri: window.location.origin,
        }}
      >
        <ThemeContext>
          <App />
        </ThemeContext>
      </Auth0Provider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
