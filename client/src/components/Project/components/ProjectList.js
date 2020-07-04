import React from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import moment from "moment";
import { TitleBanner } from "../../Common/index.js";

function ProjectList({ projects, history }) {
  if (!projects.length) {
    return <TitleBanner heading="No projects found" type="warning" noStyle />;
  }

  return (
    <Row>
      {projects.map(project => (
        <Col xs={12} s={6} lg={6} key={project.name}>
          <Card className="w-100 mb-4">
            <Card.Header>
              <Card.Title>{project.name}</Card.Title>
            </Card.Header>
            <Card.Body>
              <Card.Text>
                <p>Private: {JSON.stringify(project.private)}</p>
                <p>Tagline: {project.tagline.substr(0, 60)}</p>

                <hr />
                {project.due && (
                  <p>Due: {moment(new Date(project.due)).calendar()}</p>
                )}
                <Button onClick={() => history.push(`/project/${project._id}`)}>
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

export default ProjectList;
