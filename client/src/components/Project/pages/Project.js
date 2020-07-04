import React, { useContext, useState, useEffect, useCallback } from "react";
import gql from "graphql-tag";
import { Col, Row, Button, Card } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import { GraphQL, AuthContext } from "../../../contexts/index.js";
import { Code } from "../../Markdown/index.js";
import {
  ErrorBanner,
  LoadingBanner,
  StatusDropdown,
  StatusProgressBar
} from "../../Common/index.js";
import { TasksList, TasksFilter } from "../../Task/index.js";

const UPDATE_PROJECT_STATUS_MUTATION = gql`
  mutation updateProjectStatus($id: ID!, $status: StatusEnum!) {
    updateProjectStatus(input: { id: $id, status: $status }) {
      error {
        message
      }
      status
    }
  }
`;

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
      status
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
  const { isLoggedIn } = useContext(AuthContext.Context);
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
  const [status, setStatus] = useState("InProgress");

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
          setStatus(data.project.status);
          setLoading(false);
        }, 500);
      } catch (e) {
        setError(e.message);
        setLoading(false);
      }
    })();
  }, [tasksFilter]);

  const updateStatus = useCallback(async s => {
    setStatus(s);

    try {
      const { data } = await client.mutate({
        mutation: UPDATE_PROJECT_STATUS_MUTATION,
        variables: {
          id: match.params.id,
          status: s
        },
        fetchPolicy: "no-cache"
      });

      if (data.error) {
        throw new Error(data.error.message);
      }

      setStatus(data.updateProjectStatus.status);
    } catch (e) {
      setError(e.message);
    }
  });

  if (loading) {
    return <LoadingBanner />;
  }

  if (error) {
    return <ErrorBanner error={error} />;
  }

  return (
    <div>
      <Row className="pb-3">
        <Col>
          <h1 className="mt-3 mb-0">Project: {project.name}</h1>
          <p className="ml-1 mt-0 font-italic">{project.tagline}</p>
          <Card className="p-3 mt-3">
            <div className="d-inline">
              <Button
                className="mr-3"
                onClick={() => history.push(`/project/edit/${match.params.id}`)}
              >
                Edit
              </Button>
              <StatusDropdown
                onSelect={updateStatus}
                status={status}
                title="Select Status"
              />
            </div>
            <div className="mt-3">
              <StatusProgressBar status={status} />
            </div>
          </Card>
        </Col>
      </Row>

      <Card className="p-3">
        <ReactMarkdown source={project.markdown} renderers={{ code: Code }} />
      </Card>

      <Card className="p-3 mt-3">
        <Row>
          <Col sm={12} md={12} lg={2}>
            {isLoggedIn && (
              <Button
                className="mt-3 mb-3 w-100"
                onClick={() => history.push(`/task/create/${match.params.id}`)}
              >
                Create Task
              </Button>
            )}
            <TasksFilter onChange={setTasksFilter} />
          </Col>

          <Col sm={12} md={12} lg={10} className="mt-3">
            <TasksList
              tasks={tasks}
              history={history}
              hasNextPage={hasNextTasks}
            />
          </Col>
        </Row>
      </Card>
    </div>
  );
}

export default Project;
