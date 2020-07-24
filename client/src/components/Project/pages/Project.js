import React, { useContext, useState, useEffect } from "react";
import gql from "graphql-tag";
import { Col, Row, Card, Tab, Tabs, Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { GraphQL } from "../../../contexts/index.js";
import { Markdown } from "../../Markdown/index.js";
import { ErrorBanner, LoadingBanner } from "../../Common/index.js";
import { TasksList, TasksFilter } from "../../Task/index.js";

const PROJECT_QUERY = gql`
  query project(
    $id: ID!
    $page: Int!
    $limit: Int!
    $search: String
    $sort: String!
    $user: Boolean!
  ) {
    project(id: $id) {
      _id
      name
      tagline
      markdown
      logo
      isUserAdmin
      userCanChat
      organization {
        _id
        logo
        name
      }
      tasks(
        input: {
          page: $page
          limit: $limit
          search: $search
          sort: $sort
          user: $user
        }
      ) {
        hasNextPage
        data {
          tasks {
            _id
            name
            tagline
            due
          }
        }
      }
    }
  }
`;

function Project({ match, history }) {
  const { client } = useContext(GraphQL.Context);
  const [project, setProject] = useState();
  const [error, setError] = useState();
  const [tasksFilter, setTasksFilter] = useState({
    selected: "user",
    dateDirection: "desc",
    search: "",
    page: 1,
    limit: 6
  });
  const [tasks, setTasks] = useState([]);
  const [hasNextTasks, setHasNextTasks] = useState(false);
  const [loading, setLoading] = useState(true);
  const [key, setKey] = useState("markdown");

  useEffect(() => {
    (async () => {
      try {
        const { data, errors } = await client.query({
          query: PROJECT_QUERY,
          variables: {
            id: match.params.id,
            page: tasksFilter.page,
            limit: tasksFilter.limit,
            sort: tasksFilter.dateDirection,
            search: tasksFilter.search,
            ...(tasksFilter.selected === "user"
              ? { user: true }
              : { user: false })
          },
          fetchPolicy: "no-cache"
        });

        if (errors && errors.length) {
          throw new Error(errors[0].message);
        }

        if (!data.project) {
          history.push("/");
        }

        setTimeout(() => {
          setTasks(data.project.tasks.data.tasks);
          setHasNextTasks(data.project.tasks.hasNextPage);
          setProject(data.project);
          setLoading(false);
        }, 500);
      } catch (e) {
        setError(e.message);
        setLoading(false);
      }
    })();
  }, [tasksFilter]);

  if (loading) {
    return <LoadingBanner />;
  }

  if (error) {
    return <ErrorBanner error={error} />;
  }

  return (
    <div className="pb-3">
      <div className="d-flex justify-content-center align-items-center flex-column">
        <h1 className="mt-3 mb-0 text-center">{project.name}</h1>
        <p className="ml-1 mt-0 font-italic text-center">{project.tagline}</p>
        <Card className="p-3 d-flex justify-content-between align-items-center">
          <Card className="project-logo">
            {project.logo ? (
              <img
                className="project-logo"
                src={project.logo}
                alt="Profile Pic"
              />
            ) : (
              <div className="project-logo-icon">
                <FontAwesomeIcon icon="clipboard" size="6x" />
              </div>
            )}
          </Card>
          <div className="d-flex justify-content-between align-items-center pt-2">
            {project.isUserAdmin && (
              <Dropdown className="m-1">
                <Dropdown.Toggle
                  variant="outline-secondary"
                  id="dropdown-basic"
                >
                  <FontAwesomeIcon
                    icon="user-shield"
                    size="1x"
                    className="mr-2"
                  />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() =>
                      history.push(`/task/create/${match.params.id}`)
                    }
                  >
                    Create Task
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() =>
                      history.push(`/project/edit/${match.params.id}`)
                    }
                  >
                    Edit
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
            {project.userCanChat && (
              <Dropdown className="m-1">
                <Dropdown.Toggle variant="outline-info" id="dropdown-basic">
                  <FontAwesomeIcon icon="cog" size="1x" className="mr-2" />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() =>
                      history.push(`/project/edit/${match.params.id}`)
                    }
                  >
                    Leave
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>
          {project.organization && (
            <div className="d-flex mt-2">
              {project.organization.logo ? (
                <img
                  className="project-organization-logo"
                  src={project.organization.logo}
                  alt="Logo"
                />
              ) : (
                <div className="project-organization-logo d-flex justify-content-center align-items-center">
                  <FontAwesomeIcon icon="clipboard" size="2x" />
                </div>
              )}
              <Link to={`/organization/${project.organization._id}`}>
                {project.organization.name}
              </Link>
            </div>
          )}
        </Card>
      </div>
      <Tabs activeKey={key} onSelect={k => setKey(k)} className="mt-3">
        <Tab
          eventKey="markdown"
          title={
            <FontAwesomeIcon
              icon={["fab", "markdown"]}
              size="2x"
              color="black"
            />
          }
          unmountOnExit
        >
          <Card className="p-3 mt-3">
            <Markdown markdown={project.markdown} />
          </Card>
        </Tab>
        <Tab
          eventKey="tasks"
          title={<FontAwesomeIcon icon="sticky-note" size="2x" color="black" />}
        >
          <Card className="p-2 mt-3">
            <Row className="m-0">
              <Col className="m-0 p-2">
                <TasksFilter onChange={setTasksFilter} />
              </Col>
            </Row>
            <Row className="m-0 mb-2">
              <Col className="m-0 p-0">
                <TasksList
                  tasks={tasks}
                  history={history}
                  hasNextPage={hasNextTasks}
                />
              </Col>
            </Row>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}

export default Project;
