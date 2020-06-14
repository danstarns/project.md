import React, { useState, useContext, useEffect } from "react";
import gql from "graphql-tag";
import { Button, Row, Col, Jumbotron } from "react-bootstrap";
import { GraphQL, AuthContext } from "../../../contexts/index.js";
import { ErrorBanner, LoadingBanner } from "../../Common/index.js";
import { ProjectFilter, ProjectList } from "../components/index.js";
import "../project.css";

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
          due
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
          due
        }
      }
    }
  }
`;

function Projects({ history }) {
  const { client } = useContext(GraphQL.Context);
  const { isLoggedIn } = useContext(AuthContext.Context);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [projects, setProjects] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [filter, setFilter] = useState({
    selected: isLoggedIn ? "user" : "public",
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
          data: { result }
        } = await client.query({
          query,
          variables: {
            page: filter.page,
            limit: filter.limit,
            sort: filter.dateDirection,
            search: filter.search
          },
          fetchPolicy: "no-cache"
        });

        setError(false);
        setProjects(result.data.projects);
        setHasNextPage(result.hasNextPage);
      } catch (e) {
        setError(e.message);
      }

      setLoading(false);
    })();
  }, [filter]);

  if (error) {
    return <ErrorBanner error={error} />;
  }

  if (loading) {
    return <LoadingBanner />;
  }

  return (
    <>
      <h1 className="mt-3">Projects</h1>

      <hr />

      <Row>
        <Col sm={12} md={12} lg={2}>
          {isLoggedIn && (
            <Button
              className="mt-3 mb-3 w-100"
              onClick={() => history.push("/project/create")}
            >
              Create project
            </Button>
          )}
          <ProjectFilter onChange={setFilter} hasNextPage={hasNextPage} />
        </Col>
        <Col sm={12} md={12} lg={10} className="mt-3">
          <ProjectList projects={projects} history={history} />
        </Col>
      </Row>

      {isLoggedIn && (
        <>
          <hr />
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
      )}
    </>
  );
}

export default Projects;
