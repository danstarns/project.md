import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Row, Col, Jumbotron, Button, Alert, Spinner } from "react-bootstrap";

const ME_QUERY = gql`
  {
    me {
      username
    }
  }
`;

function Dashboard({ history }) {
  const { loading, error, data = { me: {} } } = useQuery(ME_QUERY);

  if (error) return `Error! ${error.message}`;

  return (
    <div>
      <div className="d-flex mt-3">
        <h1 className="mt-0">Dashboard</h1>
        {loading && <Spinner animation="border" className="ml-3 mt-1" />}
      </div>
      <Row className="mt-3">
        <Col xs={12} s={12} lg={12}>
          <Alert show variant="success">
            <Alert.Heading>How's it going {data.me.username}?!</Alert.Heading>
            <p>Welcome Back!</p>
          </Alert>
        </Col>
        <Col xs={12} s={12} lg={6}>
          <Jumbotron>
            <h1>Projects</h1>
            <p>
              This is a simple hero unit, a simple jumbotron-style component for
              calling extra attention to featured content or information.
            </p>
            <p>
              <Button
                onClick={() => history.push("/projects")}
                variant="primary"
              >
                Enter
              </Button>
            </p>
          </Jumbotron>
        </Col>
        <Col xs={12} s={12} lg={6}>
          <Jumbotron>
            <h1>Organizations</h1>
            <p>
              This is a simple hero unit, a simple jumbotron-style component for
              calling extra attention to featured content or information.
            </p>
            <p>
              <Button
                onClick={() => history.push("/organizations")}
                variant="primary"
              >
                Enter
              </Button>
            </p>
          </Jumbotron>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
