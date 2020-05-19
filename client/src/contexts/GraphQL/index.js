import React, { useState } from "react";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { onError } from "apollo-link-error";
import { ApolloLink } from "apollo-link";
import { ApolloProvider } from "@apollo/react-hooks";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { REACT_APP_API_URL } from "../../config.js";

const Context = React.createContext();

const httpLink = createHttpLink({
  uri: `${REACT_APP_API_URL}/graphql`
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ""
    }
  };
});

const client = new ApolloClient({
  link: ApolloLink.from([
    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        graphQLErrors.forEach(({ message }) => {
          if (message.includes("Unauthorized")) {
            window.location.href = "/logout";
          }
        });

      // eslint-disable-next-line no-console
      if (networkError) console.log(`[Network error]: ${networkError}`);
    }),
    authLink.concat(httpLink)
  ]),
  cache: new InMemoryCache()
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
