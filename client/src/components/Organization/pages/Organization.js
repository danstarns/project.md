import React, { useContext, useState, useEffect } from "react";
import gql from "graphql-tag";
import { Col, Row, Button, Jumbotron } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import { GraphQL } from "../../../contexts/index.js";
import { Code } from "../../Markdown/index.js";
import { ErrorBanner, TitleBanner, LoadingBanner } from "../../Common/index.js";
import { ProjectList, ProjectFilter } from "../../Project/index.js";

function Query() {
  return gql`
    query organization(
      $id: ID!
      $page: Int!
      $limit: Int!
      $search: String
      $sort: String!
    ) {
      organization(id: $id) {
        _id
        name
        tagline
        markdown
        projects(
          input: { page: $page, limit: $limit, search: $search, sort: $sort }
        ) {
          hasNextPage
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
}

function Organization({ match, history }) {
  const { client } = useContext(GraphQL.Context);
  const [organization, setOrganization] = useState();
  const [error, setError] = useState();
  const [projectFilter, setProjectsFilter] = useState({
    selected: "user",
    dateDirection: "desc",
    search: "",
    page: 1,
    limit: 6
  });
  const [projects, setProjects] = useState([]);
  const [hasNextProjects, setHasNextProjects] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function get() {
      try {
        const { data, errors } = await client.query({
          query: Query(),
          variables: {
            id: match.params.id,
            page: projectFilter.page,
            limit: projectFilter.limit,
            sort: projectFilter.dateDirection,
            search: projectFilter.search,
            ...(projectFilter.selected === "user"
              ? { user: true }
              : { user: false })
          },
          fetchPolicy: "no-cache"
        });

        if (errors && errors.length) {
          throw new Error(errors[0].message);
        }

        if (!data.organization) {
          history.push("/");
        }

        setProjects(data.organization.projects.projects);
        setHasNextProjects(data.organization.projects.hasNextPage);
        setOrganization(data.organization);
      } catch (e) {
        setError(e.message);
      }

      setLoading(false);
    }

    get();
  }, [projectFilter]);

  if (error) {
    return <ErrorBanner error={error} />;
  }

  if (loading) {
    return <LoadingBanner />;
  }

  function updateTasks(filter) {
    setProjectsFilter(filter);
  }

  return (
    <div>
      <TitleBanner
        heading={`Organization: ${organization.name}`}
        content={organization.tagline}
        nested={
          <>
            <hr />
            <Button
              onClick={() =>
                history.push(`/organization/edit/${match.params.id}`)
              }
            >
              Edit
            </Button>
          </>
        }
      />

      <h1>Projects</h1>
      <hr />

      <Row>
        <Col sm={12} md={12} lg={2}>
          <Button
            className="mt-3 mb-3 w-100"
            onClick={() => history.push(`/project/create/${match.params.id}`)}
          >
            Create Project
          </Button>

          <ProjectFilter onChange={updateTasks} />
        </Col>

        <Col sm={12} md={12} lg={10} className="mt-3">
          <ProjectList
            projects={projects}
            history={history}
            hasNextPage={hasNextProjects}
          />
        </Col>
      </Row>

      <h1>Markdown</h1>
      <hr />

      <Row>
        <Col xs={12} s={12} lg={12}>
          <div className="result-pane">
            <ReactMarkdown
              source={organization.markdown}
              renderers={{ code: Code }}
            />
          </div>
        </Col>
      </Row>

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
    </div>
  );
}

export default Organization;
