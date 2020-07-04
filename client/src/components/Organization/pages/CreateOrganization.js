import React, { useState, useContext, useCallback } from "react";
import gql from "graphql-tag";
import { Button } from "react-bootstrap";
import { GraphQL } from "../../../contexts/index.js";
import { OrganizationForm } from "../components/index.js";

const CREATE_ORGANIZATION_MUTATION = gql`
  mutation createOrganization(
    $name: String!
    $tagline: String!
    $private: Boolean!
    $markdown: String!
  ) {
    createOrganization(
      input: {
        name: $name
        tagline: $tagline
        private: $private
        markdown: $markdown
      }
    ) {
      error {
        message
      }
      organization {
        _id
      }
    }
  }
`;

function CreateOrganization({ history }) {
  const { client } = useContext(GraphQL.Context);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const submit = useCallback(async organization => {
    setLoading(true);

    try {
      setError(null);

      const variables = {
        name: organization.name,
        tagline: organization.tagline,
        private: Boolean(organization.private),
        markdown: organization.markdown
      };

      const response = await client.mutate({
        mutation: CREATE_ORGANIZATION_MUTATION,
        variables,
        fetchPolicy: "no-cache"
      });

      const { data: { createOrganization = {} } = {} } = response;

      if (createOrganization.error) {
        throw new Error(createOrganization.error.message);
      }

      history.push(`/organization/${createOrganization.organization._id}`);
    } catch (e) {
      setError(e.message);
    }

    setLoading(false);
  }, []);

  return (
    <div>
      <h1>Create Organization</h1>
      <OrganizationForm
        onChange={submit}
        error={error}
        loading={loading}
        defaults={{ markdown: `# Hi World Look At My Organization 👀` }}
      />
      <Button
        block
        variant="warning"
        onClick={() => history.goBack()}
        className="mb-3"
      >
        Cancel
      </Button>
    </div>
  );
}

export default CreateOrganization;
