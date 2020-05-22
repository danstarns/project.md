import React from "react";
import { Row, Col, Alert } from "react-bootstrap";

function LoadingBanner({ heading, content, type = "success" }) {
  return (
    <Row>
      <Col xs={12} s={12} lg={12}>
        <Alert show variant={type} className="mt-3">
          <Alert.Heading>{heading}</Alert.Heading>
          <p>{content}</p>
        </Alert>
      </Col>
    </Row>
  );
}

export default LoadingBanner;
