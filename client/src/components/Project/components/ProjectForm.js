import React, { useState, useEffect, useCallback } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import DatePicker from "react-date-picker";
import { Editor } from "../../Markdown/index.js";
import { LoadingBanner } from "../../Common/index.js";

function ProjectForm({
  defaults = { due: new Date() },
  onChange,
  loading,
  error,
  cancel
}) {
  const [name, setName] = useState(defaults.name);
  const [tagline, setTagline] = useState(defaults.tagline);
  const [_private, setPrivate] = useState(defaults.private);
  const [markdown, setMarkdown] = useState(defaults.markdown);
  const [due, setDue] = useState(defaults.due);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    setValidationError(null);
  }, [name, tagline, _private, markdown, due]);

  const updateDue = useCallback(date => {
    const selectedDate = new Date(date);

    if (selectedDate < new Date()) {
      setValidationError("Due date must be in the future");

      return;
    }

    setDue(new Date(date));
  }, []);

  const submit = useCallback(
    e => {
      e.preventDefault();

      onChange({ name, tagline, private: _private, markdown, due });
    },
    [name, tagline, _private, markdown, due]
  );

  return (
    <Form onSubmit={submit}>
      <Form.Group controlId="name">
        <Form.Label>Name</Form.Label>
        <Form.Control
          autoFocus
          type="text"
          placeholder="Enter Project Name"
          required
          value={name}
          onChange={e => setName(e.target.value)}
          maxLength="60"
        />
      </Form.Group>
      <Form.Group controlId="date">
        <div>
          Select Due Date: <DatePicker onChange={updateDue} value={due} />{" "}
        </div>
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
          onChange={e => setTagline(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="markdown">
        <Form.Label>Markdown</Form.Label>
        <Card className="p-3">
          <Editor onChange={setMarkdown} markdown={markdown} />
        </Card>
      </Form.Group>
      {Boolean(error || validationError) && (
        <Alert variant="danger text-center" className="mt-3">
          {error || validationError}
        </Alert>
      )}
      {loading && <LoadingBanner />}
      <div className="d-flex justify-content-end">
        <Form.Group controlId="private">
          <Form.Check
            type="checkbox"
            label="Select To Make Private"
            onChange={e => setPrivate(e.target.checked)}
            checked={_private}
            className="mt-2 mr-3"
          />
        </Form.Group>
        <Button variant="warning" onClick={cancel}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" className="ml-2">
          Submit
        </Button>
      </div>
    </Form>
  );
}

export default ProjectForm;
