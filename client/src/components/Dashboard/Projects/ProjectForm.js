import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Row, Col, Card } from "react-bootstrap";
import DatePicker from "react-date-picker";
import moment from "moment";
import Editor from "../../Editor/index.js";
import { ErrorBanner, LoadingBanner, TitleBanner } from "../../Common/index.js";

function ProjectForm({ defaults = {}, onChange, loading, error }) {
  const [name, setName] = useState(defaults.name);
  const [tagline, setTagline] = useState(defaults.tagline);
  const [_private, setPrivate] = useState(defaults.private);
  const [markdown, setMarkdown] = useState(defaults.markdown);
  const [wantDue, setWantDue] = useState(defaults.private);
  const [due, setDue] = useState(defaults.due);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    setValidationError(null);
  }, [name, tagline, _private, markdown, due, onChange]);

  function updateName(event) {
    setName(event.target.value);
  }

  function updateTagline(event) {
    setTagline(event.target.value);
  }

  function updatePrivate(event) {
    setPrivate(event.target.checked);
  }

  function updateWantDue() {
    setWantDue(!wantDue);
  }

  function updateDue(date) {
    const selectedDate = new Date(date);

    if (selectedDate < new Date()) {
      setValidationError("Due date must be in the future");

      return;
    }

    setDue(new Date(date));
  }

  function updateMarkdown(value) {
    setMarkdown(value);
  }

  function submit(e) {
    e.preventDefault();

    onChange({ name, tagline, private: _private, markdown, due });
  }

  return (
    <Form onSubmit={submit} className="mt-3">
      <Row>
        <Col xs={6} s={6} lg={6}>
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>

            <Form.Control
              type="text"
              placeholder="Enter Project Name"
              required
              value={name}
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

            {Boolean(wantDue || due) && (
              <div>
                Select Due Date: <DatePicker onChange={updateDue} value={due} />{" "}
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
              {Boolean(wantDue || due) && (
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

      {validationError && <ErrorBanner error={validationError} />}
      {error && <ErrorBanner error={error} />}
      {loading && <LoadingBanner />}

      <Button variant="primary" type="submit" block className="mt-3 mb-3">
        Submit
      </Button>
    </Form>
  );
}

export default ProjectForm;
