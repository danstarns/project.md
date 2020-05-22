import React, { useState, useContext, useEffect } from "react";
import gql from "graphql-tag";
import { Button, Row, Col, Card, Jumbotron, ListGroup } from "react-bootstrap";
import { GraphQL } from "../../../contexts/index.js";
import { ErrorBanner, LoadingBanner } from "../../Common/index.js";

function Query() {
  return gql`
    query userProjects($page: Int!, $limit: Int!) {
      userProjects(input: { page: $page, limit: $limit }) {
        hasNextPage
        data {
          projects {
            _id
            name
            tagline
          }
        }
      }
    }
  `;
}

const filterTypes = [
  ["user", "My Projects"],
  ["public", "Public Projects"],
  ["search", "Search: "]
];

function Projects({ history }) {
  const { client } = useContext(GraphQL.Context);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState([]);
  const [filterType, setFilterType] = useState("user");

  useEffect(() => {
    (async () => {
      try {
        const {
          data: {
            userProjects: { data }
          }
        } = await client.query({
          query: Query(),
          variables: { page, limit: 6 }
        });

        setError(false);
        setProjects(data.projects);
        setLoading(false);
      } catch (e) {
        setError(e.message);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType]);

  function filterTypeMapper([type, display]) {
    return (
      <ListGroup.Item onClick={() => setFilterType(type)}>
        {display}
      </ListGroup.Item>
    );
  }

  function ProjectCards() {
    return (
      <Row>
        {projects.map(project => (
          <Col xs={12} s={6} lg={6}>
            <Card bg="light" className="w-100 mb-4">
              <Card.Header />
              <Card.Body>
                <Card.Title>{project.title}</Card.Title>
                <Card.Text>
                  {project.tagline} <hr />
                  <Button
                    onClick={() => history.push(`/project/${project._id}`)}
                  >
                    Enter
                  </Button>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    );
  }

  if (error) {
    return <ErrorBanner error={error} />;
  }

  if (loading) {
    return <LoadingBanner />;
  }

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

      <Row>
        <Col sm={4}>
          <ListGroup>{filterTypes.map(filterTypeMapper)}</ListGroup>
        </Col>
        <Col sm={8}>
          <ProjectCards />
        </Col>
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
