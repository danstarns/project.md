import React from "react";
import { Col, Row } from "react-bootstrap";
import Input from "./Input.js";
import Markdown from "./Markdown.js";
import "../markdown.css";

function Editor(props) {
  return (
    <Row>
      <Col xs={6} s={6} lg={6}>
        <Input
          mode="markdown"
          theme="light"
          value={props.markdown}
          onChange={e => props.onChange(e.target.value)}
        />
      </Col>
      <Col xs={6} s={6} lg={6}>
        <Markdown markdown={props.markdown} />
      </Col>
    </Row>
  );
}

export default Editor;
