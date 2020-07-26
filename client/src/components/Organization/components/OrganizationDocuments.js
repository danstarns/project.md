import React, { useState, useContext, useEffect, useCallback } from "react";
import gql from "graphql-tag";
import { Alert, Button, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ErrorBanner, LoadingBanner } from "../../Common/index.js";
import {
  DocumentSelect,
  DocumentView,
  ExportDocumentDropdown,
  DeleteDocumentModal
} from "../../Document/index.js";
import { GraphQL, AuthContext } from "../../../contexts/index.js";
import "../organization.css";

const ORGANIZATION_DOCUMENTS_QUERY = gql`
  query documents($type: DocumentTypeEnum!, $subject: ID!) {
    documents(input: { type: $type, subject: $subject }) {
      _id
      name
    }
  }
`;

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

function OrganizationDocuments(props) {
  const { client } = useContext(GraphQL.Context);
  const { isLoggedIn } = useContext(AuthContext.Context);
  const [loading, setLoading] = useState();
  const [error, setError] = useState();
  const [documents, setDocuments] = useState([]);
  const [document, setDocument] = useState({});
  const [selected, setSelected] = useState();
  const [deleteModal, setDeleteModal] = useState(false);

  const getDocuments = useCallback(async () => {
    try {
      const response = await client.query({
        query: ORGANIZATION_DOCUMENTS_QUERY,
        variables: {
          type: "organization",
          subject: props.organization._id
        },
        fetchPolicy: "no-cache"
      });

      if (response.errors) {
        throw new Error(response.errors[0].message);
      }

      setDocuments(response.data.documents);
    } catch (e) {
      setError(e.message);
    }

    setLoading(false);
  });

  useEffect(() => {
    getDocuments();
  }, []);

  const getDocument = useCallback(async () => {
    setLoading(true);

    try {
      const response = await client.query({
        query: DOCUMENT_QUERY,
        variables: {
          id: selected.value
        },
        fetchPolicy: "no-cache"
      });

      if (response.errors) {
        throw new Error(response.errors[0].message);
      }

      setDocument(response.data.document);
    } catch (e) {
      setError(e.message);
    }

    setLoading(false);
  }, [selected]);

  useEffect(() => {
    if (selected) {
      getDocument();
    }
  }, [selected, getDocument]);

  if (error) {
    return (
      <div className="pb-2">
        <ErrorBanner error={error} />;
      </div>
    );
  }

  if (loading) {
    return (
      <div className="pb-5">
        <LoadingBanner />
      </div>
    );
  }

  return (
    <div>
      {document && (
        <DeleteDocumentModal
          show={deleteModal}
          onHide={setDeleteModal}
          onSubmit={() => {
            setSelected();
            setDeleteModal(false);
            getDocuments();
          }}
          document={document}
        />
      )}
      <div className="d-flex">
        <div className="flex-grow-1">
          <DocumentSelect
            documents={documents}
            onSelect={setSelected}
            selected={selected}
          />
        </div>
        <div className="ml-2 d-flex">
          {Boolean(document._id && selected) && (
            <>
              <ExportDocumentDropdown document={document} />
              <Dropdown className="mx-1">
                <Dropdown.Toggle variant="outline-info" id="dropdown-basic">
                  <FontAwesomeIcon icon="cog" size="1x" className="mr-2" />
                </Dropdown.Toggle>
                <Dropdown.Menu className="mt-1">
                  <Dropdown.Item
                    variant="primary"
                    onClick={() =>
                      props.history.push(`/document/edit/${document._id}`)
                    }
                  >
                    <p className="p-0 m-0">
                      <FontAwesomeIcon icon="plus" className="mr-2" />
                      Edit
                    </p>
                  </Dropdown.Item>
                  <Dropdown.Item
                    variant="primary"
                    onClick={() => setDeleteModal(true)}
                  >
                    <p className="p-0 m-0">
                      <FontAwesomeIcon icon="trash" className="mr-2" />
                      Delete
                    </p>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </>
          )}
          {isLoggedIn && (
            <Link
              to={`/document/create/organization/${props.organization._id}`}
            >
              <Button variant="primary">
                <p className="p-0 m-0">
                  <FontAwesomeIcon icon="plus" className="mr-2" />
                  Create
                </p>
              </Button>
            </Link>
          )}
        </div>
      </div>
      <div className="mt-3">
        {document._id && selected ? (
          <DocumentView markdown={document.markdown} />
        ) : (
          <Alert variant="info">Select a document</Alert>
        )}
      </div>
    </div>
  );
}

export default OrganizationDocuments;
