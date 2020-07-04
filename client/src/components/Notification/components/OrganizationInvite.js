import React, { useCallback, useContext, useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import gql from "graphql-tag";
import { LoadingBanner, ErrorBanner } from "../../Common/index.js";
import { GraphQL } from "../../../contexts/index.js";

const ORGANIZATION_QUERY = gql`
  query organization($id: ID!, $key: ID) {
    organization(id: $id, key: $key) {
      name
      tagline
    }
  }
`;

const ORGANIZATION_INVITE_CALLBACK_MUTATION = gql`
  mutation inviteUserOrganizationCallback($id: ID!, $approve: Boolean) {
    inviteUserOrganizationCallback(input: { id: $id, approve: $approve })
  }
`;

function OrganizationInvite({ history, notification }) {
  const { client } = useContext(GraphQL.Context);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [organization, setOrganization] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const result = await client.mutate({
          mutation: ORGANIZATION_QUERY,
          variables: {
            id: notification.subject.id,
            key: notification._id
          }
        });

        if (result.errors && result.errors.length) {
          throw new Error(result.errors[0].message);
        }

        if (!result.data.organization) {
          throw new Error("Organization not found");
        }

        setOrganization(result.data.organization);
      } catch (e) {
        setError(e.message);
      }

      setLoading(false);
    })();
  }, []);

  const post = useCallback(approve => async () => {
    setLoading(true);

    try {
      await client.mutate({
        mutation: ORGANIZATION_INVITE_CALLBACK_MUTATION,
        variables: {
          id: notification._id,
          approve
        }
      });

      history.push(`/organization/${notification.subject.id}`);
    } catch (e) {
      setError(e.message);
    }

    setLoading(false);
  });

  if (loading) {
    return <LoadingBanner />;
  }

  if (error) {
    return <ErrorBanner error={error} />;
  }

  return (
    <div className="d-flex flex-column align-items-center">
      <Card className="mt-3 p-3">
        <h1>Invitation to Organization: {organization.name}</h1>
        <div className="d-flex flex-column align-items-center">
          <FontAwesomeIcon size="6x" icon="building" />
        </div>
        <div className="d-flex flex-row justify-content-center mt-3">
          <Button onClick={post(true)} variant="primary" className="m-1">
            Accept
          </Button>
          <Button onClick={post(false)} variant="danger" className="m-1">
            Reject
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default OrganizationInvite;
