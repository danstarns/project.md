import React, { useState, useContext, useEffect } from "react";
import gql from "graphql-tag";
import { Button, Row, Col, Card, Jumbotron } from "react-bootstrap";
import { GraphQL } from "../../../contexts/index.js";
import { ErrorBanner, LoadingBanner } from "../../Common/index.js";
import ProjectsFilter from "./ProjectsFilter.js";
import "./projects.css";

const userProjects = gql`
  query userProjects(
    $page: Int!
    $limit: Int!
    $sort: DateSortEnum!
    $search: String
  ) {
    result: userProjects(
      input: { page: $page, limit: $limit, sort: $sort, search: $search }
    ) {
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

const publicProjects = gql`
  query publicProjects(
    $page: Int!
    $limit: Int!
    $sort: DateSortEnum!
    $search: String
  ) {
    result: publicProjects(
      input: { page: $page, limit: $limit, sort: $sort, search: $search }
    ) {
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

function Projects({ history }) {
  const { client } = useContext(GraphQL.Context);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [projects, setProjects] = useState([]);
  const [hasNextPage, setHasNextPage] = useState([]);
  const [filter, setFilter] = useState({
    selected: "user",
    dateDirection: "desc",
    search: "",
    page: 1,
    limit: 6
  });

  useEffect(() => {
    (async () => {
      try {
        const query =
          filter.selected === "user" ? userProjects : publicProjects;

        const {
          data: {
            result: { data }
          }
        } = await client.query({
          query,
          variables: {
            page: filter.page,
            limit: filter.limit,
            sort: filter.dateDirection,
            search: filter.search
          }
        });

        setError(false);
        setProjects(data.projects);
        setHasNextPage(data.hasNextPage);
        setLoading(false);
      } catch (e) {
        setError(e.message);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  function onChange(update) {
    setFilter(update);
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
          <ProjectsFilter onChange={onChange} hasNextPage={hasNextPage} />
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
