import React from "react";
import { Row, Col, Alert } from "react-bootstrap";

function ErrorBanner({ error }) {
  return (
    <Row>
      <Col>
        <Alert show className="mt-3" variant="danger">
          {error}
        </Alert>
      </Col>
    </Row>
  );
}

export default ErrorBanner;
