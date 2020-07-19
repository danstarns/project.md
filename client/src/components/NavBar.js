import React, { useContext } from "react";
import { Navbar, Nav, NavDropdown, Card } from "react-bootstrap";
import { useQuery } from "@apollo/react-hooks";
import { Link, useHistory } from "react-router-dom";
import gql from "graphql-tag";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AuthContext } from "../contexts/index.js";
import "../index.css";

const ME_QUERY = gql`
  {
    me {
      username
      profilePic
      notificationCount
    }
  }
`;

function LoggedIn() {
  const { getId } = useContext(AuthContext.Context);
  const history = useHistory();
  const { error, data = { me: {} } } = useQuery(ME_QUERY);

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
            Dashboard
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
      <Nav className="d-flex flex-row">
        <Link to="/notifications" className="navbar-no-decoration">
          <Card className="p-1 m-1">
            <Nav.Item as="span">
              <span className="navbar-notification-icon">
                <FontAwesomeIcon icon="bell" size="1x" />
                <strong>{data.me.notificationCount}</strong>
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
              {data.me.profilePic ? (
                <div className="navbar-profile-icon">
                  <img
                    className="navbar-profile m-0 p-0"
                    src={data.me.profilePic}
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
  return (
    <Nav>
      <Nav.Link as="span">
        <Link to="/login">Login</Link>
      </Nav.Link>
      <Nav.Link as="span">
        <Link to="/signup">SignUp</Link>
      </Nav.Link>
      <Nav.Link as="span">
        <Link to="/organizations">Organizations</Link>
      </Nav.Link>
      <Nav.Link as="span">
        <Link to="/projects">Projects</Link>
      </Nav.Link>
    </Nav>
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
