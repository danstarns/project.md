import React from "react";
import { Row, Col, Alert } from "react-bootstrap";

function LoadingBanner({
  heading,
  content,
  type = "success",
  noStyle,
  nested
}) {
  return (
    <Row>
      <Col xs={12} s={12} lg={12}>
        <Alert show variant={type} className={noStyle ? "" : "mt-3"}>
          <Alert.Heading>{heading}</Alert.Heading>
          <p>{content}</p>
          {nested && nested}
        </Alert>
      </Col>
    </Row>
  );
}

export default LoadingBanner;
