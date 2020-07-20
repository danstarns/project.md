import React, { useState, useContext, useEffect } from "react";
import gql from "graphql-tag";
import { Button, Row, Col, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GraphQL, AuthContext } from "../../../contexts/index.js";
import { ErrorBanner, LoadingBanner } from "../../Common/index.js";
import { ProjectFilter, ProjectList } from "../components/index.js";
import "../project.css";

const USER_PROJECTS_QUERY = gql`
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
          private
        }
      }
    }
  }
`;

const PUBLIC_PROJECTS_QUERY = gql`
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
          private
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
          filter.selected === "user"
            ? USER_PROJECTS_QUERY
            : PUBLIC_PROJECTS_QUERY;

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
    <Card className="p-2 mb-3">
      <Row className="m-0 d-flex p-0 pb-1 px-2 mt-1">
        <h1 className="mr-auto mt-0">Projects</h1>
        {isLoggedIn && (
          <Button
            className="mt-0"
            onClick={() => history.push("/project/create")}
          >
            <FontAwesomeIcon icon="plus" className="mr-2" />
            Create
          </Button>
        )}
      </Row>
      <Row className="m-0">
        <Col className="m-0 p-2">
          <ProjectFilter onChange={setFilter} hasNextPage={hasNextPage} />
        </Col>
      </Row>
      <Row className="m-0">
        <Col className="m-0 p-0">
          <ProjectList projects={projects} history={history} />
        </Col>
      </Row>
    </Card>
  );
}

export default Projects;
