import React from "react";
import { Jumbotron, Button } from "react-bootstrap";

function NoPowerHere({ history }) {
  return (
    <div className="mt-3">
      <Jumbotron>
        <h1>You have no power here!</h1>
        <Button onClick={() => history.push("/login")}>Login</Button>
      </Jumbotron>
    </div>
  );
}

export default NoPowerHere;
