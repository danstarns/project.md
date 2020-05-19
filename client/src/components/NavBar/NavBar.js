import React, { useContext } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../../contexts/index.js";

const defaultLinks = [["Home", "/"]];

const guestLinks = [
  ...defaultLinks,
  ["Signup", "/signup"],
  ["Login", "/login"]
];

const userLinks = [
  ...defaultLinks,
  ["My Account", "/account"],
  ["Dashboard", "/dashboard"],
  ["Logout", "/logout"]
];

function linkMapper([display, link]) {
  return (
    <Nav.Link>
      <Link to={link}>{display}</Link>
    </Nav.Link>
  );
}

function NavBar() {
  const { isLoggedIn } = useContext(AuthContext.Context);

  let links;

  if (isLoggedIn) {
    links = userLinks.map(linkMapper);
  } else {
    links = guestLinks.map(linkMapper);
  }

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand>
        <Link to="/" className="title-link">
          # Project.md
        </Link>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">{links}</Navbar.Collapse>
    </Navbar>
  );
}

export default NavBar;
