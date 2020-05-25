import React from "react";
import { Col, Row } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import Input from "./Input.js";
import Code from "./Code.js";
import "../markdown.css";

function Editor(props) {
  function onChange(event) {
    props.onChange(event.target.value);
  }

  return (
    <Row>
      <Col xs={6} s={6} lg={6}>
        <Input
          mode="markdown"
          theme="monokai"
          value={props.markdown}
          onChange={onChange}
        />
      </Col>
      <Col xs={6} s={6} lg={6}>
        <div className="result-pane">
          <ReactMarkdown source={props.markdown} renderers={{ code: Code }} />
        </div>
      </Col>
    </Row>
  );
}

export default Editor;