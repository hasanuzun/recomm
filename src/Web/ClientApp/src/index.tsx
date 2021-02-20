import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core/styles";
import { LocalizeProvider } from "./shared/contexts/localize";
import { CookiesProvider } from "react-cookie";
import theme from "./themes/default";
import { AuthProvider } from "./shared/contexts/auth";
import "./index.css";
import App from "./views/App";
import reportWebVitals from "./reportWebVitals";

const Providers = () => {
  return (
    <CookiesProvider>
      <BrowserRouter>
        <LocalizeProvider>
          <ThemeProvider theme={theme}>
            <AuthProvider>
              <App />
            </AuthProvider>
          </ThemeProvider>
        </LocalizeProvider>
      </BrowserRouter>
    </CookiesProvider>
  );
};

if (process.env.NODE_ENV === "development") {
  ReactDOM.render(<Providers />, document.getElementById("root"));
} else {
  ReactDOM.render(
    <React.StrictMode>
      <Providers />
    </React.StrictMode>,
    document.getElementById("root")
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
