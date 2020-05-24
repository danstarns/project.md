import React from "react";
import { Row, Col, Alert } from "react-bootstrap";

function LoadingBanner() {
  return (
    <Row>
      <Col>
        <Alert show className="mt-3" variant="info">
          Loading...
        </Alert>
      </Col>
    </Row>
  );
}

export default LoadingBanner;
