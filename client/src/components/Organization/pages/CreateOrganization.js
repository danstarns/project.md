import React, { useState, useContext } from "react";
import gql from "graphql-tag";
import { Row, Col } from "react-bootstrap";
import { GraphQL } from "../../../contexts/index.js";
import { OrganizationForm } from "../components/index.js";
import { TitleBanner } from "../../Common/index.js";

const Mutation = gql`
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

  async function submit(organization) {
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
        mutation: Mutation,
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
  }

  return (
    <>
      <Row>
        <Col>
          <TitleBanner
            heading="Create Organization"
            content={`Use Organization's to group projects together, invite friends or
    colleagues and share with the world!`}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <OrganizationForm
            onChange={submit}
            error={error}
            loading={loading}
            defaults={{ markdown: `# Hi World Look At My Organization 👀` }}
          />
        </Col>
      </Row>
    </>
  );
}

export default CreateOrganization;
