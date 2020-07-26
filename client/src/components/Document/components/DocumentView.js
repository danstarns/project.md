import React from "react";
import { Card } from "react-bootstrap";
import { Markdown } from "../../Markdown/index.js";

function DocumentView(props) {
  return (
    <Card className="m-0 p-3">
      <Markdown
        markdown={props.markdown}
        style={{ fontSize: "larger !important" }}
      />
    </Card>
  );
}

export default DocumentView;
