import React, { useContext } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/index.js";

function LoggedIn() {
  return (
    <>
      <Nav.Link as="span">
        <Link to="/account">My Account</Link>
      </Nav.Link>
      <Nav.Link as="span">
        <Link to="/dashboard">Dashboard</Link>
      </Nav.Link>
      <Nav.Link as="span">
        <Link to="/notifications">Notifications</Link>
      </Nav.Link>
      <Nav.Link as="span">
        <Link to="/logout">Logout</Link>
      </Nav.Link>
    </>
  );
}

function LoggedOut() {
  return (
    <>
      <Nav.Link as="span">
        <Link to="/login">Login</Link>
      </Nav.Link>
      <Nav.Link as="span">
        <Link to="/signup">SignUp</Link>
      </Nav.Link>
    </>
  );
}

function NavBar() {
  const { isLoggedIn } = useContext(AuthContext.Context);

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand>
        <Link to="/" className="title-link">
          # Project.md
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        {isLoggedIn ? LoggedIn() : LoggedOut()}
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavBar;
