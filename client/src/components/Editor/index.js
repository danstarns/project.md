import React from "react";
import { Col, Row } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import CodeEditor from "./CodeEditor.js";
import CodeBlock from "./CodeBlock.js";
import "./editor.css";

function Editor(props) {
  function onChange(event) {
    props.onChange(event.target.value);
  }

  return (
    <Row>
      <Col xs={6} s={6} lg={6}>
        <CodeEditor
          mode="markdown"
          theme="monokai"
          value={props.markdown}
          onChange={onChange}
        />
      </Col>
      <Col xs={6} s={6} lg={6}>
        <div className="result-pane">
          <ReactMarkdown
            source={props.markdown}
            renderers={{ code: CodeBlock }}
          />
        </div>
      </Col>
    </Row>
  );
}

export default Editor;
