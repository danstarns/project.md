/* eslint-disable new-cap */
import React, { useState } from "react";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { onError } from "apollo-link-error";
import { ApolloLink } from "apollo-link";
import { ApolloProvider } from "@apollo/react-hooks";
import { setContext } from "apollo-link-context";
import { createUploadLink } from "apollo-upload-client";
import { REACT_APP_API_URL, REACT_APP_JWT_KEY } from "../../config.js";

const Context = React.createContext();

const httpLink = new createUploadLink({
  uri: `${REACT_APP_API_URL}/graphql`,
  headers: {
    "keep-alive": "true"
  }
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(REACT_APP_JWT_KEY);

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ""
    }
  };
});

const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors }) => {
      if (graphQLErrors)
        graphQLErrors.forEach(({ message }) => {
          if (message.includes("Unauthorized")) {
            window.location.href = "/logout";
          }
        });
    }),
    authLink.concat(httpLink)
  ]),
  cache: new InMemoryCache({ dataIdFromObject: object => object._id || null })
});

function Provider(props) {
  const [value] = useState({ client });

  return (
    <ApolloProvider client={client}>
      <Context.Provider value={value}>{props.children}</Context.Provider>
    </ApolloProvider>
  );
}

export { Context, Provider };
