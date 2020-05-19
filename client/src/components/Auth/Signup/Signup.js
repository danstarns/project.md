import React, { useState, useContext } from "react"
import { Form, Button, Alert } from "react-bootstrap"
import { AuthContext } from "../../../contexts/index.js"

function Signup({ history }) {
  const Auth = useContext(AuthContext.Context)
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)

  function updateEmail(event) {
    setEmail(event.target.value)
  }

  function updateUsername(event) {
    setUsername(event.target.value)
  }

  function updatePassword(event) {
    setPassword(event.target.value)
  }

  async function Submit(event) {
    event.preventDefault()

    try {
      const result = await Auth.signup({ email, username, password })

      if (result.error) {
        throw result.error
      }

      history.push("/dashboard")
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <>
      {error && <Alert variant="warning">{error}</Alert>}
      <Form onSubmit={Submit}>
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
  )
}

export default Signup
