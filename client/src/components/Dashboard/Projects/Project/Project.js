import React, { useContext, useState, useEffect } from "react";
import gql from "graphql-tag";
import { Col, Row, Button, Jumbotron } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import { GraphQL } from "../../../../contexts/index.js";
import { CodeBlock } from "../../../Editor/index.js";
import {
  ErrorBanner,
  LoadingBanner,
  TitleBanner
} from "../../../Common/index.js";
import { TasksFilter } from "../../Tasks/index.js";
import TaskList from "../../Tasks/TasksList.js";

function Query() {
  return gql`
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
            }
          }
        }
      }
    }
  `;
}

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

  useEffect(() => {
    async function get() {
      try {
        const { data, errors } = await client.query({
          query: Query(),
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

        setTasks(data.project.tasks.data.tasks);
        setHasNextTasks(data.project.tasks.hasNextPage);
        setProject(data.project);
      } catch (e) {
        setError(e.message);
      }

      setLoading(false);
    }

    get();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasksFilter]);

  if (error) {
    return <ErrorBanner error={error} />;
  }

  if (loading) {
    return <LoadingBanner />;
  }

  function updateTasks(filter) {
    setTasksFilter(filter);
  }

  return (
    <div>
      <TitleBanner
        heading={`Project: ${project.name}`}
        content={project.tagline}
        nested={
          <>
            <hr />
            <Button
              onClick={() => history.push(`/project/edit/${match.params.id}`)}
            >
              Edit
            </Button>
          </>
        }
      />

      <h1>Tasks</h1>
      <hr />

      <Row>
        <Col sm={12} md={12} lg={2}>
          <Button
            className="mt-3 mb-3 w-100"
            onClick={() => history.push(`/task/create/${match.params.id}`)}
          >
            Create Task
          </Button>

          <TasksFilter onChange={updateTasks} />
        </Col>

        <Col sm={12} md={12} lg={10} className="mt-3">
          <TaskList
            tasks={tasks}
            history={history}
            hasNextPage={hasNextTasks}
          />
        </Col>
      </Row>

      <h1>Markdown</h1>
      <hr />

      <Row>
        <Col xs={12} s={12} lg={12}>
          <div className="result-pane">
            <ReactMarkdown
              source={project.markdown}
              renderers={{ code: CodeBlock }}
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

export default Project;
