import React, { useState, useContext } from "react";
import { Form, Button } from "react-bootstrap";
import { AuthContext } from "../../../contexts/index.js";
import { ErrorBanner, LoadingBanner } from "../../Common/index.js";

function Login({ history }) {
  const Auth = useContext(AuthContext.Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function updateEmail(event) {
    setError(null);

    setEmail(event.target.value);
  }

  function updatePassword(event) {
    setError(null);

    setPassword(event.target.value);
  }

  async function submit(event) {
    setError(null);
    setLoading(true);

    event.preventDefault();

    try {
      await Auth.login({ email, password });

      history.push("/dashboard");
    } catch (e) {
      setError(e.message);
    }

    setLoading(false);
  }

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
      </Form>
    </>
  );
}

export default Login;
