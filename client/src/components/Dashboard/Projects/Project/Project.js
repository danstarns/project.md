import React, { useContext, useState, useEffect } from "react";
import gql from "graphql-tag";
import { Col, Row, Button, Card, Jumbotron } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import { GraphQL } from "../../../../contexts/index.js";
import { CodeBlock } from "../../../Editor/index.js";
import {
  ErrorBanner,
  LoadingBanner,
  TitleBanner
} from "../../../Common/index.js";

function Query() {
  return gql`
    query project($id: ID!) {
      project(id: $id) {
        _id
        name
        tagline
        markdown
      }
    }
  `;
}

function Project({ match, history }) {
  const { client } = useContext(GraphQL.Context);
  const [project, setProject] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    async function get() {
      try {
        const { data, errors } = await client.query({
          query: Query(),
          variables: { id: match.params.id }
        });

        if (errors && errors.length) {
          throw new Error(errors[0].message);
        }

        if (!data.project) {
          history.push("/");
        }

        setProject(data.project);
      } catch (e) {
        setError(e.message);

        setTimeout(() => {
          history.push("/");
        }, 1000);
      }
    }

    get();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return <ErrorBanner error={error} />;
  }

  if (!project) {
    return <LoadingBanner />;
  }

  return (
    <div>
      <TitleBanner heading={project.name} content={project.tagline} />

      <h1>Tasks</h1>
      <hr />
      <Row>
        {Array(8)
          .fill(null)
          .map(_ => (
            <Col xs={6} s={3} lg={3}>
              <Card bg="light" className="w-100 mb-4">
                <Card.Header />
                <Card.Body>
                  <Card.Title>THis will be the task title</Card.Title>
                  <Card.Text>
                    THis will be the task tagline <hr />
                    <Button>Enter</Button>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
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
