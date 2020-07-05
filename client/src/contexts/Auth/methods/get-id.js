import { REACT_APP_JWT_KEY } from "../../../config.js";

function getId() {
  const key = localStorage.getItem(REACT_APP_JWT_KEY);

  if (!key) {
    return false;
  }

  return JSON.parse(window.atob(key.split(".")[1])).sub;
}

export default getId;
