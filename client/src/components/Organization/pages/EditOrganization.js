import React, { useState, useContext, useEffect } from "react";
import gql from "graphql-tag";
import { Row, Col, Button } from "react-bootstrap";
import { GraphQL } from "../../../contexts/index.js";
import { OrganizationForm } from "../components/index.js";
import { TitleBanner, LoadingBanner } from "../../Common/index.js";

const Query = gql`
  query organization($id: ID!) {
    organization(id: $id) {
      _id
      name
      tagline
      private
      markdown
    }
  }
`;

const Mutation = gql`
  mutation editOrganization(
    $id: ID!
    $name: String!
    $tagline: String!
    $private: Boolean!
    $markdown: String!
  ) {
    editOrganization(
      input: {
        id: $id
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

function EditOrganization({ history, match }) {
  const { client } = useContext(GraphQL.Context);
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
          query: Query,
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

  async function submit(newOrganization) {
    setLoading(true);

    try {
      setError(null);

      const variables = {
        id: match.params.id,
        name: newOrganization.name,
        tagline: newOrganization.tagline,
        private: Boolean(newOrganization.private),
        markdown: newOrganization.markdown
      };

      const response = await client.mutate({
        mutation: Mutation,
        variables,
        fetchPolicy: "no-cache"
      });

      const { data: { editOrganization = {} } = {} } = response;

      if (editOrganization.error) {
        throw new Error(editOrganization.error.message);
      }

      history.push(`/organization/${editOrganization.organization._id}`);
    } catch (e) {
      setError(e.message);
    }

    setLoading(false);
  }

  if (loadingOrganization) {
    return <LoadingBanner />;
  }

  return (
    <>
      <Row>
        <Col>
          <TitleBanner heading="Edit Organization" />
        </Col>
      </Row>
      <Row>
        <Col>
          <OrganizationForm
            onChange={submit}
            error={error}
            loading={loading}
            defaults={organization}
          />

          <Button
            block
            variant="warning"
            onClick={() => history.goBack()}
            className="mb-3"
          >
            Cancel
          </Button>
        </Col>
      </Row>
    </>
  );
}

export default EditOrganization;
