import React, { useState, useContext, useCallback } from "react";
import { Form, Button, Card, Row } from "react-bootstrap";
import gql from "graphql-tag";
import { ErrorBanner, LoadingBanner } from "../../Common/index.js";
import { GraphQL } from "../../../contexts/index.js";
import "../auth.css";

const Mutation = gql`
  mutation forgotPasswordCallback($token: String!, $password: String!) {
    forgotPasswordCallback(input: { token: $token, password: $password })
  }
`;

function PasswordReset({ history, match }) {
  const { client } = useContext(GraphQL.Context);
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const updatePassword1 = useCallback(event => {
    setError(null);

    setPassword1(event.target.value);
  }, []);

  const updatePassword2 = useCallback(event => {
    setError(null);

    setPassword2(event.target.value);
  }, []);

  const submit = useCallback(
    async event => {
      event.preventDefault();

      setError(null);

      if (password1 !== password2) {
        setError("Passwords do not match");

        return;
      }

      setLoading(true);

      try {
        const { errors } = await client.mutate({
          mutation: Mutation,
          variables: {
            token: match.params.token,
            password: password1
          }
        });

        if (errors && errors.length) {
          throw new Error(errors[0].message);
        }

        history.push("/login");
      } catch (e) {
        setError(e.message);
      }

      setLoading(false);
    },
    [password1, password2]
  );

  return (
    <Row className="center">
      <Card className="p-5">
        <h1 className="m-0">Forgot Password</h1>
        <hr />
        <Form onSubmit={submit}>
          <Form.Group controlId="password">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              required
              value={password1}
              onChange={updatePassword1}
            />
          </Form.Group>
          <Form.Group controlId="password-confirm">
            <Form.Label>Password Conformation</Form.Label>
            <Form.Control
              type="password"
              required
              value={password2}
              onChange={updatePassword2}
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

export default PasswordReset;
