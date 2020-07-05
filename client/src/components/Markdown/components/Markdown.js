import React from "react";
import ReactMarkdown from "react-markdown";
import Code from "./Code.js";
import "../markdown.css";

function Markdown(props) {
  return (
    <ReactMarkdown
      className="editor-output"
      source={props.markdown}
      renderers={{ code: Code }}
    />
  );
}

export default Markdown;
