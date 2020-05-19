import React, { useState, useContext } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { AuthContext } from "../../../contexts/index.js";

function SignUp({ history }) {
  const Auth = useContext(AuthContext.Context);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  function updateEmail(event) {
    setError(null);

    setEmail(event.target.value);
  }

  function updateUsername(event) {
    setError(null);

    setUsername(event.target.value);
  }

  function updatePassword(event) {
    setError(null);

    setPassword(event.target.value);
  }

  async function submit(event) {
    setError(null);

    event.preventDefault();

    try {
      await Auth.signUp({ email, username, password });

      history.push("/dashboard");
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <>
      <br />
      <h1>SignUp</h1>
      <br />
      {error && <Alert variant="warning">{error}</Alert>}
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

        <Form.Group controlId="username">
          <Form.Label>Username</Form.Label>

          <Form.Control
            type="text"
            placeholder="Enter username"
            required
            min={5}
            max={20}
            value={username}
            onChange={updateUsername}
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

export default SignUp;
