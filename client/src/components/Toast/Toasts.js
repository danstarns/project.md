import React, { useContext } from "react";
import Toast from "./Toast.js";
import { ToastContext } from "../../contexts/index.js";

function Toasts() {
  const { toasts, removeToast } = useContext(ToastContext.Context);

  return (
    <div aria-live="polite" aria-atomic="true" className="toasts-outer">
      <div className="toasts-inner">
        {toasts.length
          ? toasts.map(t => <Toast toast={t} removeToast={removeToast} />)
          : null}
      </div>
    </div>
  );
}

export default Toasts;
