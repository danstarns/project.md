import React, { useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Row, Col, Jumbotron, Button, Alert } from "react-bootstrap";

const Query = gql`
  {
    me {
      username
    }
  }
`;

function Dashboard({ history }) {
  const { loading, error, data } = useQuery(Query);

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  return (
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
            <Button onClick={() => history.push("/projects")} variant="primary">
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
            <Button variant="primary">Enter</Button>
          </p>
        </Jumbotron>
      </Col>
    </Row>
  );
}

export default Dashboard;
