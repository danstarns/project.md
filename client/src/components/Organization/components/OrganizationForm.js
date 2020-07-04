import React, { useState, useCallback } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { Editor } from "../../Markdown/index.js";
import { ErrorBanner, LoadingBanner } from "../../Common/index.js";

function OrganizationForm({ defaults = {}, onChange, loading, error }) {
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
    <Form onSubmit={submit} className="mt-3">
      <Card className="p-3">
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
        <Form.Group controlId="private">
          <Form.Check
            type="checkbox"
            label="Select To Make Private"
            onChange={e => setPrivate(e.target.value)}
            checked={_private}
            className="ml-3"
          />
        </Form.Group>
      </Card>
      <Card className="p-3 mt-3">
        <Editor onChange={setMarkdown} markdown={markdown} />
      </Card>
      {error && <ErrorBanner error={error} />}
      {loading && <LoadingBanner />}
      <Button variant="primary" type="submit" block className="mt-3 mb-3">
        Submit
      </Button>
    </Form>
  );
}

export default OrganizationForm;
