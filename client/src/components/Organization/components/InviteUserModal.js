/* eslint-disable no-use-before-define */
import React, { useState, useContext, useCallback } from "react";
import {
  Modal,
  Form,
  Button,
  Container,
  Alert,
  Spinner
} from "react-bootstrap";
import gql from "graphql-tag";
import { GraphQL } from "../../../contexts/index.js";

const INVITE_USER_ORGANIZATION = gql`
  mutation inviteUserOrganization($id: ID!, $email: String!) {
    inviteUserOrganization(input: { id: $id, email: $email })
  }
`;

function InviteUserModal(props) {
  const { client } = useContext(GraphQL.Context);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");

  const onSubmit = useCallback(
    async event => {
      event.preventDefault();

      setLoading(true);

      try {
        setError(null);

        const variables = {
          id: props.organization._id,
          email
        };

        const { errors } = await client.mutate({
          mutation: INVITE_USER_ORGANIZATION,
          variables,
          fetchPolicy: "no-cache"
        });

        if (errors && errors.length) {
          throw new Error(errors[0].message);
        }

        onHide();
      } catch (e) {
        setError(e.message);
      }

      setLoading(false);
    },
    [email]
  );

  const onHide = useCallback(() => {
    setEmail("");
    props.onHide();
  }, []);

  return (
    <Modal show={props.show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Invite user to {props.organization.name}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          <Container>
            <Alert variant="info">
              Enter user email to invite, if found an invitation will be sent!
            </Alert>
            <Form.Group>
              <Form.Control
                size="md"
                type="email"
                placeholder="User email"
                className="mt-3"
                value={email}
                required
                onChange={e => setEmail(e.target.value)}
              />
            </Form.Group>

            {error && <Alert variant="danger">{error} </Alert>}
          </Container>
        </Modal.Body>
        <Modal.Footer>
          {loading && <Spinner animation="border" className="mr-3" />}
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            Invite
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default InviteUserModal;
