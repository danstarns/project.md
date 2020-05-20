import React, { useContext, useState, useEffect } from "react";
import gql from "graphql-tag";
import { Alert, Col, Row } from "react-bootstrap";
import { GraphQL } from "../../../../contexts/index.js";

function Query() {
  return gql`
    query project($id: ID!) {
      project(id: $id) {
        _id
        name
      }
    }
  `;
}

function Project({ match, history }) {
  const { client } = useContext(GraphQL.Context);
  const [project, setProject] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    async function get() {
      try {
        const { data, errors } = await client.query({
          query: Query(),
          variables: { id: match.params.id }
        });

        if (errors && errors.length) {
          throw new Error(errors[0].message);
        }

        if (!data.project) {
          history.push("/");
        }

        setProject(data.project);
      } catch (e) {
        setError(e.message);

        setTimeout(() => {
          history.push("/");
        }, 1000);
      }
    }

    get();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <Row>
        <Col>
          <Alert show className="mt-3" variant="warning">
            {error}
          </Alert>
        </Col>
      </Row>
    );
  }

  if (!project) {
    return (
      <Row>
        <Col>
          <Alert show className="mt-3" variant="info">
            Loading...
          </Alert>
        </Col>
      </Row>
    );
  }

  return <h1>{project.name}</h1>;
}

export default Project;
