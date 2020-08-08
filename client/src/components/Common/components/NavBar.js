import React, { useContext, useEffect, useState } from "react";
import { Navbar, Nav, NavDropdown, Card } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import gql from "graphql-tag";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  AuthContext,
  GraphQL,
  ToastContext,
  NotificationContext
} from "../../../contexts/index.js";
import "../common.css";
import NavSearch from "./NavSearch.js";

const ME_QUERY = gql`
  {
    me {
      username
      profilePic
      notificationCount
    }
  }
`;

const ME_SUBSCRIPTION = gql`
  subscription me {
    me {
      username
      profilePic
      notificationCount
    }
  }
`;

function LoggedIn() {
  const { getId } = useContext(AuthContext.Context);
  const { setNotificationCount, notificationCount } = useContext(
    NotificationContext.Context
  );
  const history = useHistory();
  const { client } = useContext(GraphQL.Context);
  const { addToast } = useContext(ToastContext.Context);
  const [profile, setProfile] = useState({});
  const [error, setError] = useState(false);
  const [navModalOpen, setNavModalOpen] = useState(false);

  useEffect(() => {
    const subscription = client
      .subscribe({
        query: ME_SUBSCRIPTION
      })
      .subscribe(msg => {
        const toast = {
          message: "Account Updated",
          variant: "success"
        };

        addToast(toast);
        setProfile(msg.data.me);
        setNotificationCount(msg.data.me.notificationCount);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const result = await client.query({
          query: ME_QUERY
        });

        if (result.errors) {
          throw new Error(result.errors[0]);
        }

        setProfile(result.data.me);
        setNotificationCount(result.data.me.notificationCount);
      } catch (e) {
        setError(e.message);
      }
    })();
  }, []);

  if (error) return `Error! ${error.message}`;

  return (
    <>
      <Nav className="mr-auto navbar-item">
        <NavDropdown title="Dashboard" id="collasible-nav-dropdown" bg="light">
          <NavDropdown.Item
            as="span"
            className="navbar-item"
            onSelect={() => history.push("/dashboard")}
          >
            My Dashboard
          </NavDropdown.Item>
          <NavDropdown.Item
            as="span"
            className="navbar-item"
            onSelect={() => history.push("/projects")}
          >
            Projects
          </NavDropdown.Item>
          <NavDropdown.Item
            as="span"
            className="navbar-item"
            onSelect={() => history.push("/organizations")}
          >
            Organizations
          </NavDropdown.Item>
        </NavDropdown>
      </Nav>
      <div className="m-0 mx-2 w-100 p-0">
        <NavSearch
          show={navModalOpen}
          onHide={() => setNavModalOpen(false)}
          onOpen={() => setNavModalOpen(true)}
        />
      </div>
      <Nav className="d-flex flex-row">
        <Link to="/notifications" className="navbar-no-decoration">
          <Card className="p-1 m-1">
            <Nav.Item as="span">
              <span className="navbar-notification-icon">
                <FontAwesomeIcon icon="bell" size="1x" />
                <strong>{notificationCount}</strong>
              </span>
            </Nav.Item>
          </Card>
        </Link>
        <Link to="/logout">
          <Card className="p-1 m-1">
            <Nav.Item as="span">
              <span className="navbar-signout-icon">
                <FontAwesomeIcon icon="sign-out-alt" size="1x" />
              </span>
            </Nav.Item>
          </Card>
        </Link>
        <Link to={`/profile/${getId()}`}>
          <Card className="p-1 m-1">
            <Nav.Item as="span">
              {profile.profilePic ? (
                <div className="navbar-profile-icon">
                  <img
                    className="navbar-profile m-0 p-0"
                    src={profile.profilePic}
                    alt="Profile Pic"
                  />
                </div>
              ) : (
                <span className="navbar-profile-icon">
                  <FontAwesomeIcon icon="user" size="1x" />
                </span>
              )}
            </Nav.Item>
          </Card>
        </Link>
      </Nav>
    </>
  );
}

function LoggedOut() {
  const history = useHistory();
  const [navModalOpen, setNavModalOpen] = useState(false);

  return (
    <>
      <Nav className="mr-auto navbar-item">
        <NavDropdown title="Dashboard" id="collasible-nav-dropdown" bg="light">
          <NavDropdown.Item
            as="span"
            className="navbar-item"
            onSelect={() => history.push("/projects")}
          >
            Projects
          </NavDropdown.Item>
          <NavDropdown.Item
            as="span"
            className="navbar-item"
            onSelect={() => history.push("/organizations")}
          >
            Organizations
          </NavDropdown.Item>
        </NavDropdown>
      </Nav>
      <div className="m-0 mx-2 w-100 p-0">
        <NavSearch
          show={navModalOpen}
          onHide={() => setNavModalOpen(false)}
          onOpen={() => setNavModalOpen(true)}
        />
      </div>
      <Nav className="d-flex flex-row">
        <Link to="/login">
          <Card className="p-1 m-1">
            <Nav.Item as="span">
              <span className="navbar-login-icon">
                <FontAwesomeIcon icon="sign-in-alt" size="1x" />
              </span>
            </Nav.Item>
          </Card>
        </Link>
        <Link to="/signup">
          <Card className="p-1 m-1">
            <Nav.Item as="span">
              <span className="navbar-signup-icon">
                <FontAwesomeIcon icon="user-plus" size="1x" />
              </span>
            </Nav.Item>
          </Card>
        </Link>
      </Nav>
    </>
  );
}

function NavBar() {
  const { isLoggedIn } = useContext(AuthContext.Context);

  return (
    <Navbar bg="light" expand="lg" collapseOnSelect>
      <Navbar.Brand>
        <Link to="/" className="title-link">
          # Project.md
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        {isLoggedIn ? <LoggedIn /> : <LoggedOut />}
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavBar;
