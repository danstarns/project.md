import React, { useState, useCallback } from "react";
import { uuid } from "../../util/index.js";

const Context = React.createContext();

function Provider(props) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback(({ id }) => {
    setToasts(t => t.filter(x => x.id !== id));
  }, []);

  const addToast = useCallback(({ variant, message }) => {
    const id = uuid();

    setToasts(t => [...t, { id, variant, message }].splice(0, 5));

    setTimeout(() => {
      removeToast({ id });
    }, 5000);
  }, []);

  return (
    <Context.Provider value={{ toasts, addToast, removeToast }}>
      {props.children}
    </Context.Provider>
  );
}

export { Context, Provider };
