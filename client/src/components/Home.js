import React, { useContext } from "react";
import { Jumbotron, Row, Col, Button } from "react-bootstrap";
import { AuthContext } from "../contexts/index.js";

function Home({ history }) {
  const { isLoggedIn } = useContext(AuthContext.Context);

  return (
    <div>
      <Jumbotron className="mt-3">
        <h1>Project.md</h1>
        <p>
          Exemplary markdown inspired project management built with; React,
          Node, GraphQL &amp; MongoDB.
        </p>

        {isLoggedIn ? (
          <Button onClick={() => history.push("/dashboard")}>Dashboard</Button>
        ) : (
          <>
            <Button className="mr-3" onClick={() => history.push("/login")}>
              Login
            </Button>
            <Button onClick={() => history.push("/signup")}>Signup</Button>
          </>
        )}
      </Jumbotron>

      <Row className="mt-3">
        <Col>
          <Jumbotron
            className="home-jumbo-button"
            onClick={() => history.push("/projects")}
          >
            <h1>Projects</h1>
          </Jumbotron>
        </Col>
        <Col>
          <Jumbotron
            className="home-jumbo-button"
            onClick={() => history.push("/organizations")}
          >
            <h1>Organizations</h1>
          </Jumbotron>
        </Col>
      </Row>
    </div>
  );
}

export default Home;
