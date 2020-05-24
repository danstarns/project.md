import React, { useContext, useEffect } from "react";
import { Alert } from "react-bootstrap";
import { AuthContext } from "../../../contexts/index.js";

/**
 * Use window.redirect if GraphQL returns 401.
 * GraphQL context is wrapping Auth context.
 */
function Logout() {
  const { logout, isLoggedIn } = useContext(AuthContext.Context);

  useEffect(() => {
    setTimeout(() => {
      logout();
    }, 1000); // time for banner to display
  }, [isLoggedIn, logout]);

  return (
    <Alert variant="warning" className="mt-3">
      Logging out...
    </Alert>
  );
}

export default Logout;
