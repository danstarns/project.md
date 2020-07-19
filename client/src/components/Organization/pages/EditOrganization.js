import React, { useState, useContext, useEffect, useCallback } from "react";
import gql from "graphql-tag";
import { Card } from "react-bootstrap";
import { GraphQL, ToastContext } from "../../../contexts/index.js";
import { OrganizationForm } from "../components/index.js";
import { LoadingBanner } from "../../Common/index.js";

const ORGANIZATION_QUERY = gql`
  query organization($id: ID!) {
    organization(id: $id) {
      _id
      name
      tagline
      private
      markdown
      logo
    }
  }
`;

const EDIT_ORGANIZATION_MUTATION = gql`
  mutation editOrganization(
    $id: ID!
    $name: String!
    $tagline: String!
    $private: Boolean!
    $markdown: String!
    $logo: Upload
  ) {
    editOrganization(
      input: {
        id: $id
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

function EditOrganization({ history, match }) {
  const { client } = useContext(GraphQL.Context);
  const { addToast } = useContext(ToastContext.Context);
  const [loading, setLoading] = useState(false);
  const [loadingOrganization, setLoadingOrganization] = useState(true);
  const [error, setError] = useState(false);
  const [organization, setOrganization] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const variables = {
          id: match.params.id
        };

        const response = await client.query({
          query: ORGANIZATION_QUERY,
          variables,
          fetchPolicy: "no-cache"
        });

        const { data = {}, errors } = response;

        if (errors && errors.length) {
          throw new Error(errors[0].message);
        }

        if (!data.organization) {
          throw new Error(`Organization not found`);
        }

        setOrganization(data.organization);
      } catch (e) {
        setError(e.message);
      }

      setLoadingOrganization(false);
    })();
  }, []);

  const submit = useCallback(async newOrganization => {
    setLoading(true);

    try {
      setError(null);

      const variables = {
        id: match.params.id,
        name: newOrganization.name,
        tagline: newOrganization.tagline,
        private: Boolean(newOrganization.private),
        markdown: newOrganization.markdown,
        ...(newOrganization.logo ? { logo: newOrganization.logo } : {})
      };

      const response = await client.mutate({
        mutation: EDIT_ORGANIZATION_MUTATION,
        variables,
        fetchPolicy: "no-cache"
      });

      const { errors, data } = response;

      if (errors && errors.length) {
        throw new Error(errors[0].message);
      }

      const toast = {
        message: `Organization '${newOrganization.name}' updated`,
        variant: "success"
      };

      addToast(toast);

      history.push(`/organization/${data.editOrganization._id}`);
    } catch (e) {
      setError(e.message);
    }

    setLoading(false);
  }, []);

  if (loadingOrganization) {
    return <LoadingBanner />;
  }

  return (
    <div className="d-flex justify-content-center align-items-center">
      <Card className="p-3 w-100">
        <h1 className="m-0">Edit Organization: {organization.name}</h1>
        <hr />
        <OrganizationForm
          onChange={submit}
          error={error}
          loading={loading}
          defaults={organization}
          cancel={() => history.goBack()}
        />
      </Card>
    </div>
  );
}

export default EditOrganization;
