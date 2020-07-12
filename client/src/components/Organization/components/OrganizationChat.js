import React, { useState, useContext, useEffect, useCallback } from "react";
import { Alert, Spinner } from "react-bootstrap";
import gql from "graphql-tag";
import { GraphQL, AuthContext } from "../../../contexts/index.js";
import "../organization.css";
import { Chat } from "../../Chat/index.js";

const ORGANIZATION_CHAT_SUBSCRIPTION = gql`
  subscription organizationChat($type: MessageTypeEnum!, $subject: ID!) {
    message(input: { type: $type, subject: $subject }) {
      _id
      content
      creator {
        _id
        username
        profilePic {
          mimetype
          data
        }
      }
      createdAt
    }
  }
`;

const ORGANIZATION_MESSAGE_QUERY = gql`
  query organizationChat(
    $type: MessageTypeEnum!
    $subject: ID!
    $page: Int!
    $limit: Int!
  ) {
    messages(
      input: { type: $type, subject: $subject, page: $page, limit: $limit }
    ) {
      messages {
        _id
        content
        creator {
          _id
          username
          profilePic {
            mimetype
            data
          }
        }
        createdAt
      }
    }
  }
`;

const ORGANIZATION_SEND_MESSAGE_MUTATION = gql`
  mutation sendOrganizationMessage(
    $type: MessageTypeEnum!
    $subject: ID!
    $content: String!
  ) {
    sendMessage(input: { type: $type, subject: $subject, content: $content })
  }
`;

function OrganizationChat(props) {
  const { client } = useContext(GraphQL.Context);
  const { getId } = useContext(AuthContext.Context);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(getId());
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  const getMessages = useCallback(async () => {
    setLoading(true);

    try {
      const response = await client.query({
        query: ORGANIZATION_MESSAGE_QUERY,
        variables: {
          type: "organization",
          subject: props.organization,
          page,
          limit: 100
        },
        fetchPolicy: "no-cache"
      });

      if (response.errors && response.errors.length) {
        throw new Error(response.errors[0].message);
      }

      setMessages(m => [...m, ...response.data.messages.messages]);
      setHasNextPage(response.data.messages.hasNextPage);
    } catch (e) {
      setError(e.message);
    }

    setLoading(false);
  }, [page]);

  const loadMore = useEffect(() => {
    setPage(p => p + 1);
  }, []);

  useEffect(() => {
    let subscription;

    (async () => {
      try {
        await getMessages();

        subscription = client
          .subscribe({
            query: ORGANIZATION_CHAT_SUBSCRIPTION,
            variables: {
              type: "organization",
              subject: props.organization
            }
          })
          .subscribe(
            msg => {
              setMessages(m => [...m, msg.data.message]);
            },
            e => {
              setError(e.message);
            }
          );

        setLoading(false);
      } catch (e) {
        setError(e.message);
      }
    })();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    setUser(getId());
  }, [props]);

  const onSubmit = useCallback(async ({ message }) => {
    try {
      const { errors } = await client.mutate({
        mutation: ORGANIZATION_SEND_MESSAGE_MUTATION,
        variables: {
          type: "organization",
          subject: props.organization,
          content: message
        }
      });

      if (errors && errors.length) {
        throw new Error(errors[0].message);
      }
    } catch (e) {
      setError(e.message);
    }
  }, []);

  if (error) {
    return (
      <div className="d-flex align-items-center justify-content-center mt-3">
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-messages">
        <Spinner className="m-5" animation="border" size="6x" />
      </div>
    );
  }

  return (
    <Chat
      messages={messages}
      user={user}
      onSubmit={onSubmit}
      hasNextPage={hasNextPage}
      loadMore={loadMore}
    />
  );
}

export default OrganizationChat;
