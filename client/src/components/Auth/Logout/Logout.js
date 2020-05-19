import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../../contexts/index.js";

function Logout() {
  const { logout, isLoggedIn } = useContext(AuthContext.Context);

  useEffect(() => {
    logout();
  }, [isLoggedIn, logout]);

  return (
    <>
      {/**
       * Use window.redirect if GraphQL returns 401.
       * GraphQL context is wrapping Auth context.
       */}
    </>
  );
}

export default Logout;
