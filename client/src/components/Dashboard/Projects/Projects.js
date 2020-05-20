import React from "react";
import { Button, Row, Col, Card, Jumbotron } from "react-bootstrap";

function Projects({ history }) {
  return (
    <>
      <h1 className="mt-3">Projects</h1>

      <Row className="mt-3">
        <Col>
          <Button
            className="mt-3 mb-3"
            onClick={() => history.push("/create-project")}
          >
            Create project
          </Button>
        </Col>
      </Row>

      <Row className="mt-3">
        {Array(6)
          .fill(null)
          .map((x, i) => (
            <Col xs={6} s={6} lg={4}>
              <Card bg="light" key={i} className="w-100 mb-4">
                <Card.Header />
                <Card.Body>
                  <Card.Title> Card Title </Card.Title>
                  <Card.Text>
                    Some quick example text to build on the card title and make
                    up the bulk of the content. <hr />
                    <Button>Enter</Button>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
      </Row>

      <Row className="mt-3">
        <Col>
          <Jumbotron>
            <h1>Recents</h1>
          </Jumbotron>
        </Col>
        <Col>
          <Jumbotron>
            <h1>Events</h1>
          </Jumbotron>
        </Col>
      </Row>
    </>
  );
}

export default Projects;
