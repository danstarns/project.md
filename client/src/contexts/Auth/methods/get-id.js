import { REACT_APP_JWT_KEY } from "../../../config.js";

function getId() {
  return JSON.parse(
    window.atob(localStorage.getItem(REACT_APP_JWT_KEY).split(".")[1])
  ).sub;
}

export default getId;
