import React, { useState, useEffect, useContext } from "react";
import { Col, Row } from "react-bootstrap";
import gql from "graphql-tag";
import ReactMarkdown from "react-markdown";
import { GraphQL } from "../../../contexts/index.js";
import { TitleBanner, ErrorBanner, LoadingBanner } from "../../Common/index.js";
import { CodeBlock } from "../../Editor/index.js";

const Query = gql`
  query task($id: ID!) {
    task(id: $id) {
      name
      markdown
    }
  }
`;

function Task({ match }) {
  const { client } = useContext(GraphQL.Context);
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data = {} } = await client.query({
          query: Query,
          variables: { id: match.params.id }
        });

        if (!data.task) {
          throw new Error("Task not found");
        }

        setTask(data.task);
      } catch (e) {
        setError(e.message);
      }

      setLoading(false);
    })();
  });

  if (error) {
    return <ErrorBanner error={error} />;
  }

  if (loading) {
    return <LoadingBanner />;
  }

  return (
    <Row>
      <Col>
        <TitleBanner heading={task.name} />
      </Col>
      <Col xs={12} s={12} lg={12}>
        <div className="result-pane">
          <ReactMarkdown
            source={task.markdown}
            renderers={{ code: CodeBlock }}
          />
        </div>
      </Col>
    </Row>
  );
}

export default Task;
