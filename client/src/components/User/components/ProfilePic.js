import React from "react";
import { Card, Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../User.css";

function ProfilePic(props) {
  return (
    <Card className="d-flex justify-content-between align-items-center p-3">
      <Card className="profile-pic mb-3">
        {props.profile.profilePic ? (
          <img
            className="profile-pic"
            src={props.profile.profilePic}
            alt="Profile Pic"
          />
        ) : (
          <div className="profile-icon">
            <FontAwesomeIcon icon="user" size="6x" />
          </div>
        )}
      </Card>
      <p className="pl-3 pr-3 profile-box-text">
        <FontAwesomeIcon icon="user-tag" size="1x" />
        <span className="ml-1">{props.profile.username}</span>
      </p>
      <p className="pl-3 pr-3 profile-box-text">
        <FontAwesomeIcon icon="at" size="1x" />
        <span className="ml-1">{props.profile.email}</span>
      </p>
      <div className="d-flex justify-content-between align-items-center pt-2">
        {props.profile.isRequester && (
          <Dropdown className="m-1">
            <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
              <FontAwesomeIcon icon="cog" size="1x" className="mr-2" />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={props.setEditUserModal}>
                Edit
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        )}
      </div>
    </Card>
  );
}

export default ProfilePic;
