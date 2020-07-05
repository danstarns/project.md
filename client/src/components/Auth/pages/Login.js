import React, { useState, useContext, useCallback } from "react";
import { Form, Button, Card, Row } from "react-bootstrap";
import { AuthContext } from "../../../contexts/index.js";
import { ErrorBanner, LoadingBanner } from "../../Common/index.js";
import "../auth.css";

function Login({ history, location }) {
  const Auth = useContext(AuthContext.Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const updateEmail = useCallback(event => {
    setError(null);

    setEmail(event.target.value);
  }, []);

  const updatePassword = useCallback(event => {
    setError(null);

    setPassword(event.target.value);
  }, []);

  const submit = useCallback(
    async event => {
      setError(null);
      setLoading(true);

      event.preventDefault();

      try {
        await Auth.login({ email, password });

        if (location.state && location.state.redirect) {
          history.push(location.state.redirect);
        } else {
          history.push("/dashboard");
        }
      } catch (e) {
        setError(e.message);
      }

      setLoading(false);
    },
    [email, password]
  );

  const gotForgotPassword = useCallback(e => {
    e.preventDefault();

    history.push("/forgot-password");
  }, []);

  return (
    <Row className="center">
      <Card className="p-5">
        <h1 className="m-0">Login</h1>
        <hr />
        <Form onSubmit={submit}>
          <Form.Group controlId="email">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              autoFocus
              autoComplete
              type="email"
              required
              value={email}
              onChange={updateEmail}
            />
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              required
              min={5}
              max={20}
              value={password}
              onChange={updatePassword}
            />
          </Form.Group>
          <Button variant="secondary" onClick={() => history.push("/signup")}>
            Signup
          </Button>
          <Button
            className="ml-3"
            variant="warning"
            onClick={gotForgotPassword}
          >
            Forgot Password
          </Button>
          <div>
            <Button block className="mt-3" variant="primary" type="submit">
              Submit
            </Button>
          </div>
          {error && <ErrorBanner error={error} />}
          {loading && <LoadingBanner />}
        </Form>
      </Card>
    </Row>
  );
}

export default Login;
