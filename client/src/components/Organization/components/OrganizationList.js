import React from "react";
import { Row, Col, Card, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../organization.css";

function OrganizationList({ organizations, history }) {
  return (
    <Row className="m-0 p-0">
      {!organizations.length && (
        <Col xs={12} className="p-2">
          <Alert variant="warning">No organizations found</Alert>
        </Col>
      )}
      {organizations.map(organization => (
        <Col xs={12} s={4} lg={4} key={organization.name} className="p-2">
          <Card
            className="w-100 h-100 organization-list-item"
            onClick={() => history.push(`/organization/${organization._id}`)}
          >
            <Card.Header>
              <div className="d-flex">
                <Card.Title>{organization.name}</Card.Title>
                {organization.private ? (
                  <FontAwesomeIcon icon="lock" className="ml-auto" />
                ) : (
                  <FontAwesomeIcon icon="lock-open" className="ml-auto" />
                )}
              </div>
              <blockquote className="pl-2 blockquote organization-blockquote-text">
                {organization.tagline.substr(0, 60)}
              </blockquote>
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
            <Card.Footer className="d-flex justify-content-between align-items-center pb-2">
              <Card className="p-2">
                <p className="p-0 m-0">
                  <FontAwesomeIcon icon="user" size="1x" className="p-0 m-0" />
                  <span className="ml-2 organization-footer-text">
                    {organization.userCount}
                  </span>
                </p>
              </Card>
              <Card className="p-2">
                <p className="p-0 m-0">
                  <FontAwesomeIcon
                    icon="clipboard"
                    size="1x"
                    className="p-0 m-0"
                  />
                  <span className="ml-2 organization-footer-text">
                    {organization.projectCount}
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
