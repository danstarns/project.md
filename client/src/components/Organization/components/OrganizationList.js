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
              <p className="font-italic">
                {organization.tagline.substr(0, 60)}
              </p>
            </Card.Header>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default OrganizationList;
