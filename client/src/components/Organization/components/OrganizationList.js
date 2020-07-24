/* eslint-disable react/no-unescaped-entities */
import React from "react";
import { Row, Col, Card, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../organization.css";
import { Link } from "react-router-dom";

function OrganizationList({ organizations }) {
  return (
    <Row className="m-0 p-0">
      {!organizations.length && (
        <Col xs={12} className="p-2">
          <Alert variant="warning">No organizations found</Alert>
        </Col>
      )}
      {organizations.map(organization => (
        <Col xs={12} s={4} lg={4} key={organization.name} className="p-2">
          <Card className="w-100 h-100 organization-list-item">
            <Card.Header>
              <div className="d-flex">
                <Card.Title className="m-0 p-0">
                  <Link to={`/organization/${organization._id}`}>
                    {organization.name}
                  </Link>
                </Card.Title>
                {organization.private ? (
                  <FontAwesomeIcon icon="lock" className="ml-auto" />
                ) : (
                  <FontAwesomeIcon icon="lock-open" className="ml-auto" />
                )}
              </div>
              <p className="m-0 mt-1 organization-blockquote-text font-italic">
                {organization.tagline.substr(0, 60)}
              </p>
            </Card.Header>
            <Card.Body className="d-flex justify-content-center align-items-center">
              {organization.logo ? (
                <img
                  className="organization-logo"
                  src={organization.logo}
                  alt="Logo"
                />
              ) : (
                <div className="organization-logo d-flex justify-content-center align-items-center">
                  <FontAwesomeIcon icon="building" size="7x" />
                </div>
              )}
            </Card.Body>
            <Card.Footer className="d-flex flex-row justify-content-center align-items-center">
              <Card className="p-2 m-1">
                <p className="p-0 m-0 organization-footer-text">
                  <FontAwesomeIcon icon="user" size="1x" className="m-0" />
                  <span className="ml-2">{organization.userCount} user's'</span>
                </p>
              </Card>
              <Card className="p-2 m-1">
                <p className="p-0 m-0 organization-footer-text">
                  <FontAwesomeIcon
                    icon="clipboard"
                    size="1x"
                    className=" m-0"
                  />
                  <span className="ml-2">
                    {organization.projectCount} project's'
                  </span>
                </p>
              </Card>
            </Card.Footer>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default OrganizationList;
