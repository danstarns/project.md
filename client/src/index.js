import React from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import ReactDOM from "react-dom";
import App from "./components/App.js";
import { icons } from "./util/index.js";

library.add(...icons);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
