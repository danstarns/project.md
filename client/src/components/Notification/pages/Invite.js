import React, { useState, useEffect, useContext } from "react";
import { Jumbotron, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import gql from "graphql-tag";
import { LoadingBanner, ErrorBanner } from "../../Common/index.js";
import { GraphQL } from "../../../contexts/index.js";
import { OrganizationInvite } from "../components/index.js";

const NOTIFICATION_QUERY = gql`
  query($id: ID!) {
    notification(id: $id) {
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
`;

function Invalid({ history }) {
  return (
    <div className="mt-3">
      <Jumbotron className="d-flex flex-column align-items-center">
        <h1>Invalid Invite</h1>
        <FontAwesomeIcon size="6x" icon="exclamation" color="#DC3545" />
        <Button className="mt-3" onClick={() => history.push("/notifications")}>
          Exit
        </Button>
      </Jumbotron>
    </div>
  );
}

function Completed({ history }) {
  return (
    <div className="mt-3">
      <Jumbotron className="d-flex flex-column align-items-center">
        <h1>Completed Invite</h1>
        <FontAwesomeIcon size="6x" icon="check" color="#28A745" />
        <Button className="mt-3" onClick={() => history.push("/notifications")}>
          Exit
        </Button>
      </Jumbotron>
    </div>
  );
}

function Invite({ match, history }) {
  const { client } = useContext(GraphQL.Context);
  const [error, setError] = useState(false);
  const [notification, setNotification] = useState({ subject: {} });

  useEffect(() => {
    (async () => {
      try {
        const result = await client.query({
          query: NOTIFICATION_QUERY,
          variables: {
            id: match.params.id
          }
        });

        if (result.errors && result.errors[0]) {
          throw new Error(result.errors[0].message);
        }

        setNotification(result.data.notification);
      } catch (e) {
        setError(e.message);
      }
    })();
  }, []);

  if (error) {
    return <ErrorBanner error={error} />;
  }

  if (!notification) {
    return <Invalid history={history} />;
  }

  if (notification.stale) {
    return <Completed history={history} />;
  }

  if (notification.subject.type === "organization") {
    return <OrganizationInvite notification={notification} history={history} />;
  }

  return <LoadingBanner />;
}

export default Invite;
