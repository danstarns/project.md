/* eslint-disable consistent-return */
import React, { useCallback } from "react";
import { ListGroup } from "react-bootstrap";
import "../notification.css";
import { Link } from "react-router-dom";

function typeSwitch(type) {
  if (type === "invitation") {
    return "invite";
  }
}

function subjectTypeSwitch(type) {
  if (type === "organization") {
    return "organization";
  }
}

function NotificationListItem(props) {
  const user = props.notification.creator.username;
  const notificationType = typeSwitch(props.notification.type);
  const subjectType = subjectTypeSwitch(props.notification.subject.type);
  const subjectName = props.notification.subject.name;

  const change = useCallback(e => {
    return e.target.checked
      ? props.selectNotification()
      : props.unselectNotification();
  }, []);

  const isFaded = Boolean(props.notification.seen || props.notification.stale);

  return (
    <ListGroup.Item
      className={`mt-3 list-group-item d-flex justify-content-between ${isFaded &&
        "notification-disabled"}`}
    >
      <p className="mt-auto mb-auto w-80">
        {user} sent a{" "}
        <Link to={`/${notificationType}/${props.notification._id}`}>
          {notificationType}
        </Link>{" "}
        about {subjectType}: {subjectName}
      </p>

      <input
        type="checkbox"
        onChange={change}
        checked={props.selected.includes(props.notification._id)}
        aria-label="Select"
        className="mt-auto mb-auto checkbox-2x mr-2"
      />
    </ListGroup.Item>
  );
}

export default NotificationListItem;
