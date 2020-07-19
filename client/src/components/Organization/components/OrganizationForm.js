import React, { useState, useCallback } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { Editor } from "../../Markdown/index.js";
import { ErrorBanner, LoadingBanner } from "../../Common/index.js";

function OrganizationForm({ defaults = {}, onChange, loading, error, cancel }) {
  const [name, setName] = useState(defaults.name);
  const [tagline, setTagline] = useState(defaults.tagline);
  const [_private, setPrivate] = useState(defaults.private);
  const [markdown, setMarkdown] = useState(defaults.markdown);

  const submit = useCallback(
    e => {
      e.preventDefault();

      onChange({ name, tagline, private: _private, markdown });
    },
    [name, tagline, _private, markdown]
  );

  return (
    <Form onSubmit={submit}>
      <Form.Group controlId="name">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          required
          value={name}
          onChange={e => setName(e.target.value)}
          maxLength="60"
        />
      </Form.Group>
      <Form.Group controlId="tagline">
        <Form.Label>Tagline</Form.Label>
        <Form.Control
          type="text"
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
      {error && <ErrorBanner error={error} />}
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

export default OrganizationForm;
