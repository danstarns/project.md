import React from "react";
import { ProgressBar } from "react-bootstrap";

function StatusProgressBar(props) {
  let now;

  // eslint-disable-next-line default-case
  switch (props.status) {
    case "Todo":
      now = 33;
      break;
    case "InProgress":
      now = 66;
      break;
    case "Done":
      now = 100;
      break;
  }

  return <ProgressBar variant="primary" now={now} label={props.status} />;
}

export default StatusProgressBar;
