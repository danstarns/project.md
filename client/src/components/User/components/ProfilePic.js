import React from "react";
import { Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../User.css";

function ProfilePic(props) {
  return (
    <Card className="p-3">
      <Card className="profile-pic mb-3 mx-auto">
        {props.profile.profilePic ? (
          <img
            className="profile-pic"
            src={`data:${props.profile.profilePic.mimetype};base64, ${props.profile.profilePic.data}`}
            alt="Profile Pic"
          />
        ) : (
          <div className="profile-icon">
            <FontAwesomeIcon icon="user" size="6x" />
          </div>
        )}
      </Card>
      <p>{props.profile.username}</p>
      <p>{props.profile.email}</p>
    </Card>
  );
}

export default ProfilePic;
