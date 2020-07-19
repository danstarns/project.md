import React, { useContext, useEffect } from "react";
import { AuthContext, ToastContext } from "../../../contexts/index.js";

function Logout() {
  const { logout } = useContext(AuthContext.Context);
  const { addToast } = useContext(ToastContext.Context);

  useEffect(() => {
    const toast = { message: "Logged Out", variant: "warning" };

    logout();

    addToast(toast);
  }, [logout]);

  return <></>;
}

export default Logout;
