import React from "react";
import { Row, Card, Col } from "react-bootstrap";
import "../User.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

function UserListCards(props) {
  return (
    <Row>
      {props.users.map(user => (
        <Col xs={12} s={3} lg={3} key={user.username}>
          <Card>
            <Card.Header className="p-2">
              <Card.Title className="m-0 text-center p-0">
                <Link to={`/profile/${user._id}`}>{user.username}</Link>
              </Card.Title>
            </Card.Header>
            <Card.Body className="d-flex justify-content-center align-items-center">
              {user.profilePic ? (
                <img
                  className="profile-pic"
                  src={user.profilePic}
                  alt="Profile Pic"
                />
              ) : (
                <div className="profile-icon">
                  <FontAwesomeIcon icon="user" size="6x" />
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default UserListCards;
