import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useRef
} from "react";
import { Alert } from "react-bootstrap";
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
      hasNextPage
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
  const user = useRef(getId());
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
          limit: 30
        },
        fetchPolicy: "no-cache"
      });

      if (response.errors && response.errors.length) {
        throw new Error(response.errors[0].message);
      }

      setHasNextPage(response.data.messages.hasNextPage);

      setMessages(m => {
        const merged = [...m, ...response.data.messages.messages];

        const mergedSet = [...new Set([...merged.map(x => x._id)])];

        return mergedSet
          .map(x => merged.find(y => y._id === x))
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      });
    } catch (e) {
      setError(e.message);
    }

    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [page]);

  useEffect(() => {
    getMessages();
  }, [page, getMessages]);

  const loadMore = useCallback(() => {
    setPage(p => p + 1);
  }, []);

  useEffect(() => {
    getMessages();

    const subscription = client
      .subscribe({
        query: ORGANIZATION_CHAT_SUBSCRIPTION,
        variables: {
          type: "organization",
          subject: props.organization
        }
      })
      .subscribe(
        msg => {
          setMessages(m => [...m, { ...msg.data.message, subscription: true }]);
        },
        e => {
          setError(e.message);
        }
      );

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

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

  return (
    <Chat
      messages={messages}
      user={user.current}
      onSubmit={onSubmit}
      hasNextPage={hasNextPage}
      loadMore={() => loadMore()}
      loading={loading}
      page={page}
    />
  );
}

export default OrganizationChat;
