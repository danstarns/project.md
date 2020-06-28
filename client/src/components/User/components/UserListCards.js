import React from "react";
import { Row, Card } from "react-bootstrap";
import "../User.css";

function UserListCards(props) {
  return (
    <Row className="d-flex flex-row w-100 justify-content-left user-list-container">
      {props.users.map(user => (
        <Card key={user.username} className="m-4 user-list-card">
          <div className="row h-100 justify-content-center align-items-center">
            {user.username}
          </div>
        </Card>
      ))}
    </Row>
  );
}

export default UserListCards;
