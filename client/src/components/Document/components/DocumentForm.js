import React, { useState, useCallback } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { Editor } from "../../Markdown/index.js";
import { LoadingBanner } from "../../Common/index.js";

function DocumentForm({ defaults = {}, onChange, loading, error, cancel }) {
  const [name, setName] = useState(defaults.name);
  const [markdown, setMarkdown] = useState(defaults.markdown);

  const submit = useCallback(
    e => {
      e.preventDefault();

      onChange({ name, markdown });
    },
    [name, markdown]
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
      <Form.Group controlId="markdown">
        <Form.Label>Markdown</Form.Label>
        <Card className="p-3">
          <Editor onChange={setMarkdown} markdown={markdown} />
        </Card>
      </Form.Group>
      {error && (
        <Alert variant="danger text-center" className="mt-3">
          {error}
        </Alert>
      )}
      {loading && <LoadingBanner />}
      <div className="d-flex justify-content-end">
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

export default DocumentForm;
