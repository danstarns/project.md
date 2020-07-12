/* eslint-disable new-cap */
import React from "react";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { onError } from "apollo-link-error";
import { WebSocketLink } from "apollo-link-ws";
import { ApolloLink, split } from "apollo-link";
import { ApolloProvider } from "@apollo/react-hooks";
import { setContext } from "apollo-link-context";
import { createUploadLink } from "apollo-upload-client";
import { SubscriptionClient } from "subscriptions-transport-ws";
import {
  REACT_APP_API_URL,
  REACT_APP_JWT_KEY,
  REACT_APP_WS_URL
} from "../../config.js";

const Context = React.createContext();

const subClient = new SubscriptionClient(`${REACT_APP_WS_URL}/graphql`, {
  reconnect: true,
  connectionParams: () => {
    const token = localStorage.getItem(REACT_APP_JWT_KEY);

    return {
      authorization: token ? `Bearer ${token}` : ""
    };
  }
});

const wsLink = new WebSocketLink(subClient);

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
    split(
      ({ query: { definitions } }) =>
        definitions.some(
          ({ kind, operation }) =>
            kind === "OperationDefinition" && operation === "subscription"
        ),
      wsLink,
      authLink.concat(httpLink)
    )
  ]),
  cache: new InMemoryCache({ dataIdFromObject: object => object._id || null })
});

function Provider(props) {
  return (
    <ApolloProvider client={client}>
      <Context.Provider value={{ client }}>{props.children}</Context.Provider>
    </ApolloProvider>
  );
}

export { Context, Provider };
