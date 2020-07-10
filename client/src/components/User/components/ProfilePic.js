import React from "react";
import { Card, Button } from "react-bootstrap";
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
      <p className="pl-3 pr-3 profile-box-text">
        <FontAwesomeIcon icon="user-tag" />
        <span className="ml-1">{props.profile.username}</span>
      </p>
      <p className="pl-3 pr-3 profile-box-text">
        <FontAwesomeIcon icon="at" />
        <span className="ml-1">{props.profile.email}</span>
      </p>
      {props.profile.isRequester && (
        <Button
          className="m-0 mb-3"
          variant="primary"
          onClick={props.setEditUserModal}
        >
          Edit
        </Button>
      )}
    </Card>
  );
}

export default ProfilePic;
