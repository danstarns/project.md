import React, { useState } from "react";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import { Editor } from "../../Markdown/index.js";
import { ErrorBanner, LoadingBanner, TitleBanner } from "../../Common/index.js";

function OrganizationForm({ defaults = {}, onChange, loading, error }) {
  const [name, setName] = useState(defaults.name);
  const [tagline, setTagline] = useState(defaults.tagline);
  const [_private, setPrivate] = useState(defaults.private);
  const [markdown, setMarkdown] = useState(defaults.markdown);

  function updateName(event) {
    setName(event.target.value);
  }

  function updateTagline(event) {
    setTagline(event.target.value);
  }

  function updatePrivate(event) {
    setPrivate(event.target.checked);
  }

  function updateMarkdown(value) {
    setMarkdown(value);
  }

  function submit(e) {
    e.preventDefault();

    onChange({ name, tagline, private: _private, markdown });
  }

  return (
    <Form onSubmit={submit} className="mt-3">
      <Row>
        <Col xs={6} s={6} lg={6}>
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>

            <Form.Control
              type="text"
              placeholder="Enter Organization Name"
              required
              value={name}
              onChange={updateName}
              maxLength="60"
            />
          </Form.Group>

          <Form.Group controlId="tagline">
            <Form.Label>Tagline</Form.Label>

            <Form.Control
              type="text"
              placeholder="Enter Organization Tagline"
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
              checked={_private}
              className="ml-3"
            />
          </Form.Group>
        </Col>

        <Col xs={6} s={6} lg={6}>
          <Card bg="light" className="w-100 mt-4">
            <Card.Header />
            <Card.Body>
              <Card.Title>{name}</Card.Title>
              <Form.Check
                type="checkbox"
                label="Private"
                checked={_private}
                disabled
              />
              <Card.Text>{tagline}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <hr />

      <TitleBanner
        heading="Enter Markdown"
        content={`Use the box on the left to start writing markdown, as you type
    the output will render on the right. This will be shown on the
    organizations homepage.`}
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
  );
}

export default OrganizationForm;
