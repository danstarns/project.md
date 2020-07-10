import React from "react";
import { Toast } from "react-bootstrap";
import "./toast.css";

function ToastComponent(props) {
  return (
    <Toast
      animation
      key={props.toast.id}
      className="toast-item"
      onClose={() => props.removeToast(props.toast)}
    >
      <Toast.Header className="toast-header">
        <div className={`bg-${props.toast.variant} toast-icon`} />
        <span className="mr-auto" />
      </Toast.Header>
      <Toast.Body className="toast-body">{props.toast.message}</Toast.Body>
    </Toast>
  );
}

export default ToastComponent;
