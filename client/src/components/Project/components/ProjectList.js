import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import { TitleBanner } from "../../Common/index.js";
import "../project.css";

function ProjectList({ projects, history }) {
  if (!projects.length) {
    return <TitleBanner heading="No projects found" type="warning" noStyle />;
  }

  return (
    <Row>
      {projects.map(project => (
        <Col xs={12} s={4} lg={4} key={project.name} className="w-100 mb-2">
          <Card
            className="w-100 h-100 project-list-item"
            onClick={() => history.push(`/project/${project._id}`)}
          >
            <Card.Header>
              <div className="d-flex">
                <Card.Title>{project.name}</Card.Title>
                {project.private ? (
                  <FontAwesomeIcon icon="lock" className="ml-auto" />
                ) : (
                  <FontAwesomeIcon icon="lock-open" className="ml-auto" />
                )}
              </div>
              <p className="font-italic">{project.tagline.substr(0, 60)}</p>
            </Card.Header>
            <Card.Body>
              <Card.Text>
                {project.due && (
                  <p>Due: {moment(new Date(project.due)).calendar()}</p>
                )}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default ProjectList;
