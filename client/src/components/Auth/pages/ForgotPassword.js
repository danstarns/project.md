import React, { useState, useContext, useCallback } from "react";
import { Form, Button, Card, Row, Modal } from "react-bootstrap";
import gql from "graphql-tag";
import { ErrorBanner, LoadingBanner } from "../../Common/index.js";
import { GraphQL, AuthContext } from "../../../contexts/index.js";
import "../auth.css";

const Mutation = gql`
  mutation forgotPasswordRequest($search: String!) {
    forgotPasswordRequest(input: { search: $search })
  }
`;

function ForgotPassword({ history }) {
  const { client } = useContext(GraphQL.Context);
  const Auth = useContext(AuthContext.Context);

  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const handleClose = useCallback(() => {
    history.push("/login");

    setShow(false);
  }, []);

  const updateSearch = useCallback(event => {
    setError(null);

    setSearch(event.target.value);
  }, []);

  const submit = useCallback(
    async event => {
      setError(null);
      setLoading(true);

      event.preventDefault();

      try {
        const { errors } = await client.mutate({
          mutation: Mutation,
          variables: {
            search
          }
        });

        if (errors && errors.length) {
          throw new Error(errors[0].message);
        }

        setShow(true);
      } catch (e) {
        setError(e.message);
      }

      setLoading(false);
    },
    [search]
  );

  if (Auth.isLoggedIn) {
    history.push("/dashboard");
  }

  function SuccessModal() {
    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Forgot Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          If a user is found, a email will be send with further instructions
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  return (
    <Row className="center">
      <Card className="pt-2 pb-3 pl-4 pr-4">
        <h1 className="m-0">Forgot Password</h1>
        <hr />
        <SuccessModal />
        <Form onSubmit={submit}>
          <Form.Group controlId="search">
            <Form.Label>Email or Username</Form.Label>
            <Form.Control
              type="text"
              required
              value={search}
              onChange={updateSearch}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
          {error && <ErrorBanner error={error} />}
          {loading && <LoadingBanner />}
        </Form>
      </Card>
    </Row>
  );
}

export default ForgotPassword;
