import React, { useState, useCallback } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Editor } from "../../Markdown/index.js";
import { LoadingBanner } from "../../Common/index.js";

function OrganizationForm({ defaults = {}, onChange, loading, error, cancel }) {
  const [name, setName] = useState(defaults.name);
  const [tagline, setTagline] = useState(defaults.tagline);
  const [_private, setPrivate] = useState(defaults.private);
  const [markdown, setMarkdown] = useState(defaults.markdown);
  const [logo, setLogo] = useState(defaults.logo);
  const [blob, setBlob] = useState();
  const [imageError, setImageError] = useState(false);

  const submit = useCallback(
    e => {
      e.preventDefault();

      onChange({ name, tagline, private: _private, markdown, logo: blob });
    },
    [name, tagline, _private, markdown, blob]
  );

  const changePic = useCallback(event => {
    setImageError(false);

    const acceptedTypes = ["image/png", "image/jpeg"];
    if (!acceptedTypes.includes(event.target.files[0].type)) {
      setImageError("Invalid file type");
      return;
    }

    const image = new Image();
    const url = URL.createObjectURL(event.target.files[0]);
    image.src = url;
    setBlob(event.target.files[0]);

    image.onload = () => {
      if (image.naturalWidth > 200 || image.naturalHeight > 200) {
        setImageError("200px 200px Dimensions");
      } else {
        setLogo(url);
      }
    };
  }, []);

  return (
    <Form onSubmit={submit}>
      <Card className="organization-logo mx-auto">
        {logo ? (
          <img className="organization-logo" src={logo} alt="Profile Pic" />
        ) : (
          <div className="organization-logo-icon">
            <FontAwesomeIcon icon="user" size="6x" />
          </div>
        )}
      </Card>
      <Form.Group>
        <Form.Label>Logo</Form.Label>
        <div>
          <input type="file" onChange={changePic} accept="image/*" />
        </div>
      </Form.Group>
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
      {Boolean(error || imageError) && (
        <Alert variant="danger text-center" className="mt-3">
          {error || imageError}
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
        <Button
          variant="primary"
          type="submit"
          className="ml-2"
          disabled={!!loading || !!error || !!imageError}
        >
          Submit
        </Button>
      </div>
    </Form>
  );
}

export default OrganizationForm;
