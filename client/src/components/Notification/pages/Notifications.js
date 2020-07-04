import React, { useState, useCallback, useContext, useEffect } from "react";
import { ListGroup, Alert, Spinner, Jumbotron, Button } from "react-bootstrap";
import gql from "graphql-tag";
import { GraphQL } from "../../../contexts/index.js";
import {
  NotificationListItem,
  NotificationListOptions
} from "../components/index.js";

const NOTIFICATION_QUERY = gql`
  query notifications($page: Int!, $limit: Int!) {
    notifications(input: { page: $page, limit: $limit }) {
      hasNextPage
      notifications {
        _id
        creator {
          username
        }
        type
        subject {
          id
          type
          name
        }
        seen
        stale
      }
    }
  }
`;

const DELETE_NOTIFICATIONS_MUTATION = gql`
  mutation deleteNotifications($ids: [ID]!) {
    deleteNotifications(ids: $ids)
  }
`;

const VIEW_NOTIFICATIONS_MUTATION = gql`
  mutation viewNotifications($ids: [ID]!) {
    viewNotifications(ids: $ids)
  }
`;

function Notifications() {
  const { client } = useContext(GraphQL.Context);
  const [notifications, setNotifications] = useState([]);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const getNotifications = useCallback(async () => {
    setLoading(true);

    try {
      const res = await client.query({
        query: NOTIFICATION_QUERY,
        variables: {
          page,
          limit: 20
        },
        fetchPolicy: "no-cache"
      });

      if (res.errors && res.errors.length) {
        throw new Error(res.errors[0].message);
      }

      setNotifications(res.data.notifications.notifications);
      setHasNextPage(res.data.notifications.hasNextPage);
    } catch (e) {
      setError(e.message);
    }

    setLoading(false);
  }, [page]);

  useEffect(() => {
    getNotifications();
  }, []);

  const deleteNotifications = useCallback(async () => {
    if (!selectedNotifications.length) {
      return;
    }

    setLoading(true);

    try {
      await client.mutate({
        mutation: DELETE_NOTIFICATIONS_MUTATION,
        variables: {
          ids: selectedNotifications.map(x => x._id)
        }
      });

      setSelectedNotifications([]);
      setPage(1);
      getNotifications();
    } catch (e) {
      setError(e.message);
    }

    setLoading(false);
  }, [selectedNotifications]);

  const viewNotifications = useCallback(async () => {
    if (!selectedNotifications.length) {
      return;
    }

    setLoading(true);

    try {
      await client.mutate({
        mutation: VIEW_NOTIFICATIONS_MUTATION,
        variables: {
          ids: selectedNotifications.map(x => x._id)
        }
      });

      setSelectedNotifications([]);
      setPage(1);
      getNotifications();
    } catch (e) {
      setError(e.message);
    }

    setLoading(false);
  }, [selectedNotifications]);

  const incPage = useCallback(() => {
    setPage(x => x - 1);
    setSelectedNotifications([]);
  });

  const decPage = useCallback(() => {
    setPage(x => x + 1);
    setSelectedNotifications([]);
  });

  const updatePage = useCallback(up => () => (up ? incPage() : decPage()));

  const selectNotification = useCallback(n => {
    setSelectedNotifications(x => [...x, n]);
  });

  const unselectNotification = useCallback(n => {
    setSelectedNotifications(current => current.filter(x => x._id !== n._id));
  });

  return (
    <div>
      <div className="d-flex mt-3">
        <h1 className="mt-0">Notifications</h1>
        {loading && <Spinner animation="border" className="ml-3 mt-1" />}
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Jumbotron className="p-2 pb-5">
        <NotificationListOptions
          selected={selectedNotifications}
          viewNotifications={viewNotifications}
          deleteNotifications={deleteNotifications}
        />

        {!notifications.length ? (
          <Alert variant="warning">No Notifications found</Alert>
        ) : (
          <ListGroup>
            {notifications.map(notification => (
              <NotificationListItem
                notification={notification}
                selected={selectedNotifications.map(x => x._id)}
                selectNotification={() => selectNotification(notification)}
                unselectNotification={() => unselectNotification(notification)}
              />
            ))}
          </ListGroup>
        )}

        <div className="d-flex justify-content-center mt-3">
          {page > 1 && (
            <Button variant="secondary" onClick={updatePage(false)}>
              Go Back
            </Button>
          )}
          {hasNextPage && (
            <Button
              variant="primary"
              className="ml-3"
              onClick={updatePage(true)}
            >
              <p className="mb-0">
                Next
                {loading && (
                  <Spinner
                    animation="border"
                    size="sm"
                    className="ml-3 mt-0"
                    as="span"
                  />
                )}
              </p>
            </Button>
          )}
        </div>
      </Jumbotron>
    </div>
  );
}

export default Notifications;
