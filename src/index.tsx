import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import { css, Global } from "@emotion/react";
import Web3Provider from "./Web3Provider";

ReactDOM.render(
  <React.StrictMode>
    <Web3Provider>
      <Router>
        <Global
          styles={css`
            @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap");
            * {
              box-sizing: border-box;
              margin-top: 0;
              margin-left: 0;
              margin-right: 0;
              margin-bottom: 0;
              padding-top: 0;
              padding-left: 0;
              padding-right: 0;
              padding-bottom: 0;
              font-family: "Inter", sans-serif;
            }

            html,
            body {
              font-size: 10px;
              background: #efefef;
            }
            body {
              padding: 1rem;
            }

            a,
            a:visited {
              color: rgb(184, 4, 247);
            }
          `}
        />
        <App />
      </Router>
    </Web3Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
