import React, { useState, useContext, useCallback, useEffect } from "react";
import { Modal, Form, Button, Alert, Spinner, Card } from "react-bootstrap";
import gql from "graphql-tag";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GraphQL } from "../../../contexts/index.js";

const EDIT_PROFILE_MUTATION = gql`
  mutation editProfile(
    $username: String
    $email: String
    $password: String
    $profilePic: Upload
  ) {
    editProfile(
      input: {
        username: $username
        email: $email
        password: $password
        profilePic: $profilePic
      }
    ) {
      username
      email
      profilePic {
        data
        mimetype
      }
      isRequester
    }
  }
`;

function EditProfileModal(props) {
  const { client } = useContext(GraphQL.Context);

  const [email, setEmail] = useState();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [password2, setPassword2] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [profilePic, setProfilePic] = useState(
    props.profile.profilePic
      ? `data:${props.profile.profilePic.mimetype};base64, ${props.profile.profilePic.data}`
      : false
  );
  const [blob, setBlob] = useState();
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (password !== password2) {
      setError("Passwords don't match");
    }
  }, [password, password2]);

  useEffect(() => {
    setError(null);
  }, [email, username, password]);

  const onSubmit = useCallback(
    async event => {
      event.preventDefault();

      if (error || imageError) {
        return;
      }

      setLoading(true);

      try {
        const variables = {
          email,
          username,
          ...(password ? { password } : {}),
          ...(blob ? { profilePic: blob } : {})
        };

        const { errors, data } = await client.mutate({
          mutation: EDIT_PROFILE_MUTATION,
          variables,
          fetchPolicy: "no-cache"
        });

        if (errors && errors.length) {
          throw new Error(errors[0].message);
        }

        props.setProfile(data.editProfile);

        props.onHide();
      } catch (e) {
        setError(e.message);
      }

      setLoading(false);
    },
    [email, username, password, blob, error]
  );

  const changePic = useCallback(
    event => {
      setImageError(false);

      const acceptedTypes = ["image/png", "image/jpeg"];
      if (!acceptedTypes.includes(event.target.files[0].type)) {
        setImageError("Invalid file type");
        return;
      }

      const image = new Image();
      const url = URL.createObjectURL(event.target.files[0]);
      image.src = url;
      setBlob(event.target.files[0]);

      image.onload = () => {
        if (image.naturalWidth > 200 || image.naturalHeight > 200) {
          setImageError("200px 200px Dimensions");
        } else {
          setProfilePic(url);
        }
      };
    },
    [email, username, password]
  );

  return (
    <Modal show={props.show} onHide={props.onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-3">
        <Form onSubmit={onSubmit}>
          <Card className="d-flex justify-content-center align-items-center profile-pic mx-auto">
            {profilePic ? (
              <img className="profile-pic" src={profilePic} alt="Profile Pic" />
            ) : (
              <div className="profile-icon">
                <FontAwesomeIcon icon="user" size="6x" />
              </div>
            )}
          </Card>
          <Form.Group className="mt-3">
            <Form.Label>Profile Pic</Form.Label>
            <div>
              <input type="file" onChange={changePic} accept="image/*" />
            </div>
          </Form.Group>
          <Form.Group controlId="email">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              defaultValue={props.profile.email}
              autoFocus
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control
              defaultValue={props.profile.username}
              type="text"
              required
              min={5}
              max={20}
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </Form.Group>
          <Card className="p-3" border="warning">
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                defaultValue=""
                autoComplete="new-password"
                autoCorrect="off"
                spellCheck="off"
                type="password"
                min={5}
                max={20}
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="password-confirm">
              <Form.Label>Password Confirm</Form.Label>
              <Form.Control
                defaultValue=""
                autoComplete="new-password"
                autoCorrect="off"
                spellCheck="off"
                type="password"
                min={5}
                max={20}
                value={password2}
                onChange={e => setPassword2(e.target.value)}
              />
            </Form.Group>
          </Card>
          {Boolean(error || imageError) && (
            <Alert variant="danger text-center" className="mt-3">
              {error || imageError}
            </Alert>
          )}
          <Button onClick={props.onHide} className="mt-3" variant="secondary">
            Cancel
          </Button>
          <Button
            className="mt-3 ml-3"
            variant="primary"
            type="submit"
            disabled={!!loading || !!error || !!imageError}
          >
            {loading ? (
              <span>
                <Spinner animation="border" size="sm" /> Loading
              </span>
            ) : (
              "Edit"
            )}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default EditProfileModal;
