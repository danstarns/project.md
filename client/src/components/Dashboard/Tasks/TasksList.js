/* eslint-disable no-underscore-dangle */
import React from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import moment from "moment";
import { TitleBanner } from "../../Common/index.js";

function TaskList({ tasks, history }) {
  if (!tasks.length) {
    return <TitleBanner heading="No tasks found" type="warning" noStyle />;
  }

  return (
    <Row>
      {tasks.map(task => (
        <Col xs={12} s={6} lg={6}>
          <Card bg="light" className="w-100 mb-4 project-list-item">
            <Card.Header>
              <Card.Title>{task.name}</Card.Title>
            </Card.Header>
            <Card.Body>
              <Card.Text>
                {task.tagline.substr(0, 60)} <hr />
                {task.due && (
                  <p>Due: {moment(new Date(task.due)).calendar()}</p>
                )}
                <Button onClick={() => history.push(`/task/${task._id}`)}>
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

export default TaskList;
