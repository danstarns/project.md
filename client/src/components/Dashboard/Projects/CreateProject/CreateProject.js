import React, { useState } from "react";
import { Form, Button, Alert, Row, Col, Card } from "react-bootstrap";
import DatePicker from "react-date-picker";
import moment from "moment";
import Editor from "../../../Editor/index.js";

function CreateProject({ history }) {
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [_private, setPrivate] = useState(false);
  const [wantDue, setWantDue] = useState(false);
  const [markdown, setMarkdown] = useState(
    `# My Project \n look at my super cool project 🍺`
  );
  const [due, setDue] = useState(new Date());
  const [error, setError] = useState("");

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

  return (
    <>
      {error && (
        <Alert className="mt-3" variant="warning">
          {error}
        </Alert>
      )}
      <br />
      <Form>
        <Row>
          <Col xs={12} s={12} lg={12}>
            <Alert show className="mt-3" variant="success">
              <Alert.Heading>Create Project</Alert.Heading>
              <p>
                Use projects to group tasks together, invite friends or
                colleagues and share with the world!
              </p>
            </Alert>
          </Col>

          <Col xs={6} s={6} lg={6}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>

              <Form.Control
                type="text"
                placeholder="Enter Project Name"
                required
                checked={name}
                onChange={updateName}
                maxLength="50"
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
                maxLength="200"
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

        <Row>
          <Col xs={12} s={12} lg={12}>
            <Alert show variant="info">
              <Alert.Heading>Enter Markdown</Alert.Heading>
              <p>
                Use the box on the left to start writing markdown, as you type
                the output will render on the right. This will be shown on the
                projects homepage.
              </p>
            </Alert>
          </Col>
        </Row>

        <div className="mb-3">
          <Editor onChange={updateMarkdown} markdown={markdown} />
        </div>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </>
  );
}

export default CreateProject;
