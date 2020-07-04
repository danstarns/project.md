import React from "react";
import { ListGroup, Button } from "react-bootstrap";
import "../notification.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function NotificationListOptions(props) {
  return (
    <ListGroup.Item className="mb-3 d-flex justify-content-end align-items-center">
      <p className="pt-3 mr-3 font-weight-bold">
        {props.selected.length} selected
      </p>
      <Button
        size="sm"
        className="d-inline mr-3"
        onClick={props.deleteNotifications}
      >
        Delete
        <FontAwesomeIcon icon="trash" className="ml-3" />
      </Button>
      <Button size="sm" className="d-inline" onClick={props.viewNotifications}>
        Seen
        <FontAwesomeIcon icon="glasses" className="ml-3" />
      </Button>
    </ListGroup.Item>
  );
}

export default NotificationListOptions;
