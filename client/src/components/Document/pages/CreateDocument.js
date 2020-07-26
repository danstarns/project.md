import React, { useState, useContext, useCallback } from "react";
import gql from "graphql-tag";
import { Card } from "react-bootstrap";
import { GraphQL } from "../../../contexts/index.js";
import { DocumentForm } from "../components/index.js";

const CREATE_DOCUMENT_MUTATION = gql`
  mutation createDocument(
    $name: String!
    $markdown: String!
    $type: DocumentTypeEnum!
    $subject: ID!
  ) {
    createDocument(
      input: {
        name: $name
        markdown: $markdown
        type: $type
        subject: $subject
      }
    ) {
      _id
    }
  }
`;

function CreateDocument({ history, match }) {
  const { client } = useContext(GraphQL.Context);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const submit = useCallback(async organization => {
    setLoading(true);

    try {
      setError(null);

      const variables = {
        name: organization.name,
        markdown: organization.markdown,
        type: match.params.type,
        subject: match.params.id
      };

      const response = await client.mutate({
        mutation: CREATE_DOCUMENT_MUTATION,
        variables,
        fetchPolicy: "no-cache"
      });

      const { errors } = response;

      if (errors && errors.length) {
        throw new Error(errors[0].message);
      }

      history.goBack();
    } catch (e) {
      setError(e.message);
    }

    setLoading(false);
  }, []);

  return (
    <div className="d-flex justify-content-center align-items-center">
      <Card className="p-3 w-100">
        <h1 className="m-0">Create Document</h1>
        <hr />
        <DocumentForm
          onChange={submit}
          error={error}
          loading={loading}
          defaults={{ markdown: `# Hi World Look At My Document 👀` }}
          cancel={() => history.goBack()}
        />
      </Card>
    </div>
  );
}

export default CreateDocument;
