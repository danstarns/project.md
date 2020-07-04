import React, { useState, useEffect, useContext } from "react";
import { Col, Row, Button, Card } from "react-bootstrap";
import gql from "graphql-tag";
import ReactMarkdown from "react-markdown";
import { GraphQL } from "../../../contexts/index.js";
import { ErrorBanner, LoadingBanner } from "../../Common/index.js";
import { Code } from "../../Markdown/index.js";

const TASK_QUERY = gql`
  query task($id: ID!) {
    task(id: $id) {
      name
      tagline
      markdown
    }
  }
`;

function Task({ match, history }) {
  const { client } = useContext(GraphQL.Context);
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data = {} } = await client.query({
          query: TASK_QUERY,
          variables: { id: match.params.id },
          fetchPolicy: "no-cache"
        });

        if (!data.task) {
          throw new Error("Task not found");
        }

        setTask(data.task);
      } catch (e) {
        setError(e.message);
      }

      setTimeout(() => {
        setLoading(false);
      }, 500);
    })();
  }, []);

  if (error) {
    return <ErrorBanner error={error} />;
  }

  if (loading) {
    return <LoadingBanner />;
  }

  return (
    <Row className="pb-3">
      <Col>
        <h1 className="mt-3 mb-0">Task: {task.name}</h1>
        <p className="ml-1 mt-0 font-italic">{task.tagline}</p>
        <Card className="p-3 mt-3">
          <div>
            <Button
              className="btn btn-primary"
              onClick={() => history.push(`/task/edit/${match.params.id}`)}
            >
              Edit
            </Button>
          </div>
        </Card>
      </Col>
      <Col xs={12} s={12} lg={12} className="mt-3">
        <Card className="p-3">
          <ReactMarkdown source={task.markdown} renderers={{ code: Code }} />
        </Card>
      </Col>
    </Row>
  );
}

export default Task;
