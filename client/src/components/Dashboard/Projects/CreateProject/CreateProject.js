import React, { useState, useContext } from "react";
import { Form, Button, Alert, Row, Col, Card } from "react-bootstrap";
import DatePicker from "react-date-picker";
import moment from "moment";
import gql from "graphql-tag";
import Editor from "../../../Editor/index.js";
import { GraphQL } from "../../../../contexts/index.js";
import {
  ErrorBanner,
  LoadingBanner,
  TitleBanner
} from "../../../Common/index.js";

const Mutation = gql`
  mutation createProject(
    $name: String!
    $tagline: String!
    $private: Boolean!
    $due: String
    $markdown: String!
  ) {
    createProject(
      input: {
        name: $name
        tagline: $tagline
        private: $private
        due: $due
        markdown: $markdown
      }
    ) {
      error {
        message
      }
      project {
        _id
      }
    }
  }
`;

function CreateProject({ history }) {
  const { client } = useContext(GraphQL.Context);
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [_private, setPrivate] = useState(false);
  const [wantDue, setWantDue] = useState(false);
  const [markdown, setMarkdown] = useState(
    `# My Project \n look at my super cool project 🍺`
  );
  const [due, setDue] = useState();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateName(event) {
    setError(null);

    setName(event.target.value);
  }

  function updateTagline(event) {
    setError(null);

    setTagline(event.target.value);
  }

  function updatePrivate(event) {
    setError(null);

    setPrivate(event.target.checked);
  }

  function updateWantDue() {
    setError(null);

    setWantDue(!wantDue);
  }

  function updateDue(date) {
    const selectedDate = new Date(date);

    if (selectedDate < new Date()) {
      setError("Due date must be in the future");

      return;
    }

    setError(null);

    setDue(new Date(date));
  }

  function updateMarkdown(value) {
    setError(null);

    setMarkdown(value);
  }

  async function submit(event) {
    event.preventDefault();

    setLoading(true);

    try {
      setError(null);

      const variables = {
        name,
        tagline,
        private: _private,
        markdown,
        ...(due ? { due: due.toISOString() } : {})
      };

      const response = await client.mutate({
        mutation: Mutation,
        variables
      });

      const { data: { createProject = {} } = {} } = response;

      if (createProject.error) {
        throw new Error(createProject.error.message);
      }

      // eslint-disable-next-line no-underscore-dangle
      history.push(`/project/${createProject.project._id}`);
    } catch (e) {
      setError(e.message);
    }

    setLoading(false);
  }

  return (
    <>
      <Form onSubmit={submit} className="mt-3">
        <TitleBanner
          heading="Create Project"
          content={`Use projects to group tasks together, invite friends or
                colleagues and share with the world!`}
        />

        <Row>
          <Col xs={6} s={6} lg={6}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>

              <Form.Control
                type="text"
                placeholder="Enter Project Name"
                required
                checked={name}
                onChange={updateName}
                maxLength="60"
              />
            </Form.Group>

            <Form.Group controlId="date">
              <Alert variant="info" className="w-75">
                <Form.Check
                  label="Want A Due Date?"
                  onChange={updateWantDue}
                  value={wantDue}
                />
              </Alert>

              {wantDue && (
                <div>
                  Select Due Date:{" "}
                  <DatePicker onChange={updateDue} value={due} />{" "}
                </div>
              )}
            </Form.Group>

            <Form.Group controlId="tagline">
              <Form.Label>Tagline</Form.Label>

              <Form.Control
                type="text"
                placeholder="Enter Project Tagline"
                required
                as="textarea"
                rows="3"
                value={tagline}
                maxLength="60"
                onChange={updateTagline}
              />
            </Form.Group>

            <Form.Group controlId="private">
              <Form.Check
                type="checkbox"
                label="Select To Make Private"
                onChange={updatePrivate}
                value={_private}
                className="ml-3"
              />
            </Form.Group>
          </Col>

          <Col xs={6} s={6} lg={6}>
            <Card bg="light" className="w-100 mt-4">
              <Card.Header />
              <Card.Body>
                <Card.Title>{name}</Card.Title>
                {_private && (
                  <Form.Check
                    type="checkbox"
                    label="Private"
                    checked={_private}
                    disabled
                  />
                )}
                <Card.Text>{tagline}</Card.Text>
                {wantDue && (
                  <Card.Text>
                    Due On: {moment(due).format("MMMM Do YYYY, h:mm:ss a")}
                  </Card.Text>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <hr />

        <TitleBanner
          heading="Enter Markdown"
          content={`Use the box on the left to start writing markdown, as you type
          the output will render on the right. This will be shown on the
          projects homepage.`}
          type="info"
        />

        <Editor onChange={updateMarkdown} markdown={markdown} />

        <hr />

        {error && <ErrorBanner error={error} />}
        {loading && <LoadingBanner />}

        <Button variant="primary" type="submit" block className="mt-3 mb-3">
          Submit
        </Button>
      </Form>
    </>
  );
}

export default CreateProject;
