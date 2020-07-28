import React from "react";
import { Jumbotron } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function NotFound() {
  return (
    <div className="mt-3">
      <Jumbotron className="d-flex flex-column align-items-center">
        <h1>404</h1>
        <p>Not Found!</p>
        <FontAwesomeIcon size="6x" icon="robot" />
      </Jumbotron>
    </div>
  );
}

export default NotFound;
