/* eslint-disable react/jsx-props-no-spreading */
import React, { useContext } from "react";
import { Route } from "react-router-dom";
import { Jumbotron, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AuthContext } from "../../contexts/index.js";

function NoPowerHere({ history, location }) {
  return (
    <div className="mt-3">
      <Jumbotron className="d-flex flex-column align-items-center">
        <h1>You have no power here!</h1>
        <FontAwesomeIcon size="6x" icon="user-lock" />
        <Button
          size="lg"
          className="mt-4"
          onClick={() =>
            history.push("/login", { redirect: location.pathname })
          }
        >
          Login
        </Button>
      </Jumbotron>
    </div>
  );
}

function Protected({ exact, path, component: Component }) {
  const { isLoggedIn } = useContext(AuthContext.Context);

  return (
    <Route
      exact={exact}
      path={path}
      render={props => {
        if (!isLoggedIn) {
          return <NoPowerHere {...props} />;
        }

        return <Component {...props} />;
      }}
    />
  );
}

export default Protected;
