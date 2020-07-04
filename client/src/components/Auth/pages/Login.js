import React, { useState, useContext, useCallback } from "react";
import { Form, Button } from "react-bootstrap";
import { AuthContext } from "../../../contexts/index.js";
import { ErrorBanner, LoadingBanner } from "../../Common/index.js";

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
    <>
      <br />
      <h1>Login</h1>
      <br />
      {error && <ErrorBanner error={error} />}
      {loading && <LoadingBanner />}
      <br />
      <Form onSubmit={submit}>
        <Form.Group controlId="email">
          <Form.Label>Email address</Form.Label>

          <Form.Control
            autoFocus
            autoComplete
            type="email"
            placeholder="Enter email"
            required
            value={email}
            onChange={updateEmail}
          />
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>

          <Form.Control
            type="password"
            placeholder="Password"
            required
            min={5}
            max={20}
            value={password}
            onChange={updatePassword}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
        <Button className="ml-3" variant="warning" onClick={gotForgotPassword}>
          Forgot Password
        </Button>
      </Form>
    </>
  );
}

export default Login;
