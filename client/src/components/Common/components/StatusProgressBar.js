import React from "react";
import { ProgressBar } from "react-bootstrap";

function StatusProgressBar(props) {
  let now;
  let color;

  // eslint-disable-next-line default-case
  switch (props.status) {
    case "Todo":
      now = 33;
      color = "warning";
      break;
    case "InProgress":
      now = 66;
      color = "primary";
      break;
    case "Done":
      now = 100;
      color = "success";
      break;
  }

  return <ProgressBar variant={color} now={now} label={props.status} />;
}

export default StatusProgressBar;
