/* eslint-disable no-use-before-define */
import React, { useState, useContext, useCallback } from "react";
import { Modal, Button, Alert, Spinner } from "react-bootstrap";
import gql from "graphql-tag";
import { GraphQL } from "../../../contexts/index.js";

const DELETE_DOCUMENT_MUTATION = gql`
  mutation deleteDocument($id: ID!) {
    deleteDocument(id: $id)
  }
`;

function DeleteDocumentModal(props) {
  const { client } = useContext(GraphQL.Context);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const onSubmit = useCallback(async event => {
    event.preventDefault();

    setLoading(true);

    try {
      setError(null);

      const variables = {
        id: props.document._id
      };

      const { errors } = await client.mutate({
        mutation: DELETE_DOCUMENT_MUTATION,
        variables,
        fetchPolicy: "no-cache"
      });

      if (errors && errors.length) {
        throw new Error(errors[0].message);
      }

      props.onSubmit();
    } catch (e) {
      setError(e.message);
    }

    setLoading(false);
  }, []);

  return (
    <Modal show={props.show} onHide={props.onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Document {props.document.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Alert variant="warning">Are you sure?</Alert>
      </Modal.Body>
      <Modal.Footer>
        {loading && <Spinner animation="border" className="mr-3" />}
        {error && <Alert variant="danger">{error}</Alert>}
        <Button variant="secondary" onClick={props.onHide}>
          close
        </Button>
        <Button variant="primary" type="submit" onClick={onSubmit}>
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteDocumentModal;
