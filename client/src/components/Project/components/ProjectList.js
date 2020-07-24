/* eslint-disable react/no-unescaped-entities */
import React from "react";
import { Row, Col, Card, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../project.css";
import { Link } from "react-router-dom";

function ProjectList({ projects }) {
  return (
    <Row className="m-0 p-0">
      {!projects.length && (
        <Col className="m-0 p-2">
          <Alert variant="warning" className="m-0 p-2">
            No projects found
          </Alert>
        </Col>
      )}
      {projects.map(project => (
        <Col xs={12} s={4} lg={4} key={project.name} className="p-2">
          <Card className="w-100 h-100 project-list-item">
            <Card.Header>
              <div className="d-flex">
                <Card.Title className="m-0 p-0">
                  <Link to={`/project/${project._id}`}>{project.name}</Link>
                </Card.Title>
                {project.private ? (
                  <FontAwesomeIcon icon="lock" className="ml-auto" />
                ) : (
                  <FontAwesomeIcon icon="lock-open" className="ml-auto" />
                )}
              </div>
              <p className="m-0 mt-1 project-blockquote-text font-italic">
                {project.tagline.substr(0, 60)}
              </p>
            </Card.Header>
            <Card.Body className="d-flex justify-content-center align-items-center">
              {project.logo ? (
                <img className="project-logo" src={project.logo} alt="Logo" />
              ) : (
                <div className="project-logo d-flex justify-content-center align-items-center">
                  <FontAwesomeIcon icon="clipboard" size="7x" />
                </div>
              )}
            </Card.Body>
            <Card.Footer className="d-flex flex-row justify-content-center align-items-center">
              <Card className="p-2 m-1">
                <p className="p-0 m-0 project-footer-text">
                  <FontAwesomeIcon icon="user" size="1x" className="m-0" />
                  <span className="ml-2">{project.userCount} user's'</span>
                </p>
              </Card>
              <Card className="p-2 m-1">
                <p className="p-0 m-0 project-footer-text">
                  <FontAwesomeIcon
                    icon="sticky-note"
                    size="1x"
                    className="m-0"
                  />
                  <span className="ml-2">{project.taskCount} task's'</span>
                </p>
              </Card>
            </Card.Footer>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default ProjectList;
