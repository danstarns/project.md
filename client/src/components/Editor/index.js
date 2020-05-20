import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import "./editor.css";
import CodeMirror from "./codemirror.js";
import CodeBlock from "./code-block.js";

function Editor(props) {
  function onChange(event) {
    props.onChange(event.target.value);
  }

  return (
    <Row>
      <Col xs={6} s={6} lg={6}>
        <form>
          <CodeMirror
            mode="markdown"
            theme="monokai"
            value={props.markdown}
            onChange={onChange}
          />
        </form>
      </Col>
      <Col xs={6} s={6} lg={6}>
        <div className="result-pane">
          <ReactMarkdown
            className="result"
            source={props.markdown}
            renderers={{ code: CodeBlock }}
          />
        </div>
      </Col>
    </Row>
  );
}

export default Editor;
