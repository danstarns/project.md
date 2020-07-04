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
        <Col xs={12} s={6} lg={6} key={organization.name}>
          <Card className="w-100 mb-4 ">
            <Card.Header>
              <Card.Title>{organization.name}</Card.Title>
            </Card.Header>
            <Card.Body>
              <Card.Text>
                <p>Private: {JSON.stringify(organization.private)}</p>
                <p>
                  Tagline: {organization.tagline.substr(0, 60)} <hr />
                </p>

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
