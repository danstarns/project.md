import React from "react";
import { Spinner } from "react-bootstrap";

function LoadingBanner() {
  return (
    <div className="d-flex flex-column align-items-center">
      <Spinner className="mt-5" animation="border" size="6x" />
    </div>
  );
}

export default LoadingBanner;
