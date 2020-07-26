import React, { useState, useContext, useEffect, useCallback } from "react";
import gql from "graphql-tag";
import { Card } from "react-bootstrap";
import { ErrorBanner, LoadingBanner } from "../../Common/index.js";
import { DocumentForm } from "../components/index.js";
import { GraphQL } from "../../../contexts/index.js";

const DOCUMENT_QUERY = gql`
  query($id: ID!) {
    document(id: $id) {
      _id
      url
      markdown
      name
    }
  }
`;

const EDIT_DOCUMENT_MUTATION = gql`
  mutation editDocument($id: ID!, $name: String!, $markdown: String!) {
    editDocument(input: { id: $id, name: $name, markdown: $markdown }) {
      _id
    }
  }
`;

function EditDocument({ match, history }) {
  const { client } = useContext(GraphQL.Context);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [document, setDocument] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const response = await client.query({
          query: DOCUMENT_QUERY,
          variables: {
            id: match.params.id
          }
        });

        if (response.errors) {
          throw new Error(response.errors[0].message);
        }

        setDocument(response.data.document);
      } catch (e) {
        setError(e.message);
      }

      setLoading(false);
    })();
  }, []);

  const submit = useCallback(async organization => {
    setLoading(true);

    try {
      setError(null);

      const variables = {
        id: match.params.id,
        name: organization.name,
        markdown: organization.markdown
      };

      const response = await client.mutate({
        mutation: EDIT_DOCUMENT_MUTATION,
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

  if (loading) {
    return (
      <div className="pb-5">
        <LoadingBanner />
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center align-items-center">
      <Card className="p-3 w-100">
        <h1 className="m-0">Edit Document</h1>
        <hr />
        <DocumentForm
          onChange={submit}
          error={error}
          loading={loading}
          defaults={document}
          cancel={() => history.goBack()}
        />
      </Card>
    </div>
  );
}

export default EditDocument;
