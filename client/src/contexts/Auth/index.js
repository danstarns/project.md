/* eslint-disable prefer-const */
import React, { useState, useContext } from "react";
import { signUp } from "./methods/index.js";
import * as GraphQL from "../GraphQL/index.js";

const Context = React.createContext();

function Provider(props) {
  const { client } = useContext(GraphQL.Context);

  let value;
  let setValue;

  [value, setValue] = useState({
    isLoggedIn: false,
    signUp: signUp({ client, setValue: (...args) => setValue(...args) })
  });

  return <Context.Provider value={value}>{props.children}</Context.Provider>;
}

export { Context, Provider };
