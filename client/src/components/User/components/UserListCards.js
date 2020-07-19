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
          <Card className="m-4 profile-pic">
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
            <Link to={`/profile/${user._id}`}>{user.username}</Link>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default UserListCards;
