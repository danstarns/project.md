import React, { useState, useContext, useCallback } from "react";
import { Form, Button, Card, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AuthContext } from "../../../contexts/index.js";
import { ErrorBanner, LoadingBanner } from "../../Common/index.js";
import "../auth.css";

function SignUp({ history }) {
  const Auth = useContext(AuthContext.Context);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState();
  const [blob, setBlob] = useState();

  const updateEmail = useCallback(event => {
    setError(null);

    setEmail(event.target.value);
  }, []);

  const updateUsername = useCallback(event => {
    setError(null);

    setUsername(event.target.value);
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
        await Auth.signUp({ email, username, password, profilePic: blob });

        history.push("/dashboard");
      } catch (e) {
        setError(e.message);
      }
    },
    [email, username, password]
  );

  const changePic = useCallback(
    event => {
      const image = new Image();
      setBlob(event.target.files[0]);

      const url = URL.createObjectURL(event.target.files[0]);
      image.src = url;

      image.onload = () => {
        if (image.naturalWidth > 200 || image.naturalHeight > 200) {
          setError("200px 200px Dimensions");
        } else {
          setProfilePic(url);
        }
      };
    },
    [email, username, password]
  );

  return (
    <Row className="center">
      <Form onSubmit={submit} className="mt-3">
        <Card className="p-5">
          <h1 className="m-0">SignUp</h1>
          <hr />
          <Card className="mx-auto">
            <div>
              {profilePic ? (
                <img
                  className="profile-pic"
                  src={profilePic}
                  alt="Profile Pic"
                />
              ) : (
                <div className="profile-icon">
                  <FontAwesomeIcon icon="user" size="6x" />
                </div>
              )}
            </div>
          </Card>
          <Form.Group className="mt-3">
            <Form.Label>Profile Pic</Form.Label>
            <div>
              <input type="file" onChange={changePic} />
            </div>
          </Form.Group>
          <Form.Group controlId="email">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              autoFocus
              type="email"
              required
              value={email}
              onChange={updateEmail}
            />
          </Form.Group>
          <Form.Group controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
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
              required
              min={5}
              max={20}
              value={password}
              onChange={updatePassword}
            />
          </Form.Group>
          <Button
            block
            variant="secondary"
            onClick={() => history.push("/login")}
          >
            Login
          </Button>
          <Button className="mt-3" variant="primary" type="submit">
            Submit
          </Button>
          {loading && <LoadingBanner />}
          {error && <ErrorBanner error={error} />}
        </Card>
      </Form>
    </Row>
  );
}

export default SignUp;
