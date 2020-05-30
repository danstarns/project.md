import React from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import { TitleBanner } from "../../Common/index.js";
import "../organization.css";

function OrganizationList({ organizations, history }) {
  if (!organizations.length) {
    return (
      <TitleBanner heading="No organizations found" type="warning" noStyle />
    );
  }

  return (
    <Row>
      {organizations.map(organization => (
        <Col xs={12} s={6} lg={6}>
          <Card bg="light" className="w-100 mb-4 organization-list-item">
            <Card.Header>
              <Card.Title>{organization.name}</Card.Title>
            </Card.Header>
            <Card.Body>
              <Card.Text>
                {organization.tagline.substr(0, 60)} <hr />
                <Button
                  onClick={() =>
                    history.push(`/organization/${organization._id}`)
                  }
                >
                  Enter
                </Button>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default OrganizationList;
