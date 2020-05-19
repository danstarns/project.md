import { REACT_APP_JWT_KEY } from "../../../config.js";

function logout({ setValue }) {
  return () => {
    localStorage.removeItem(REACT_APP_JWT_KEY);

    setValue(value => ({ ...value, isLoggedIn: false }));

    window.location.href = "/";
  };
}

export default logout;
