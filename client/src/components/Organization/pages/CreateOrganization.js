import React, { useState, useContext, useCallback } from "react";
import gql from "graphql-tag";
import { Card } from "react-bootstrap";
import { GraphQL, ToastContext } from "../../../contexts/index.js";
import { OrganizationForm } from "../components/index.js";

const CREATE_ORGANIZATION_MUTATION = gql`
  mutation createOrganization(
    $name: String!
    $tagline: String!
    $private: Boolean!
    $markdown: String!
    $logo: Upload
  ) {
    createOrganization(
      input: {
        name: $name
        tagline: $tagline
        private: $private
        markdown: $markdown
        logo: $logo
      }
    ) {
      _id
    }
  }
`;

function CreateOrganization({ history }) {
  const { client } = useContext(GraphQL.Context);
  const { addToast } = useContext(ToastContext.Context);
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
        markdown: organization.markdown,
        ...(organization.logo ? { logo: organization.logo } : {})
      };

      const response = await client.mutate({
        mutation: CREATE_ORGANIZATION_MUTATION,
        variables,
        fetchPolicy: "no-cache"
      });

      const { errors, data } = response;

      if (errors && errors.length) {
        throw new Error(errors[0].message);
      }

      const toast = {
        message: `Organization '${organization.name}' created`,
        variant: "success"
      };

      addToast(toast);

      history.push(`/organization/${data.createOrganization._id}`);
    } catch (e) {
      setError(e.message);
    }

    setLoading(false);
  }, []);

  return (
    <div className="d-flex justify-content-center align-items-center">
      <Card className="p-3 w-100">
        <h1 className="m-0">Create Organization</h1>
        <hr />
        <OrganizationForm
          onChange={submit}
          error={error}
          loading={loading}
          defaults={{ markdown: `# Hi World Look At My Organization 👀` }}
          cancel={() => history.goBack()}
        />
      </Card>
    </div>
  );
}

export default CreateOrganization;
