import React from "react";
import { Toast, Alert } from "react-bootstrap";
import "./toast.css";

function ToastComponent(props) {
  return (
    <Toast animation key={props.toast.id} className="toast-item border-0">
      <Alert
        variant={props.toast.variant}
        className="h-100 w-100 m-0 border-0"
        onClick={() => props.removeToast(props.toast)}
      >
        {props.toast.message}
      </Alert>
    </Toast>
  );
}

export default ToastComponent;
