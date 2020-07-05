/* eslint-disable prefer-const */
import React, { useState, useContext } from "react";
import { signUp, logout, login, getId } from "./methods/index.js";
import * as GraphQL from "../GraphQL/index.js";
import { REACT_APP_JWT_KEY } from "../../config.js";

const Context = React.createContext();

function Provider(props) {
  const { client } = useContext(GraphQL.Context);

  let value;
  let setValue;

  const setter = (...args) => setValue(...args); // pass by reference

  [value, setValue] = useState({
    isLoggedIn: Boolean(localStorage.getItem(REACT_APP_JWT_KEY)),
    signUp: signUp({ client, setValue: setter }),
    logout: logout({ setValue: setter }),
    login: login({ client, setValue: setter }),
    getId
  });

  return <Context.Provider value={value}>{props.children}</Context.Provider>;
}

export { Context, Provider };
