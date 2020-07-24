import React from "react";
import { Row, Col, Card, Alert, Button } from "react-bootstrap";
import moment from "moment";
import "../task.css";

function TaskList({ tasks, history }) {
  return (
    <Row className="m-0 p-0">
      {!tasks.length && (
        <Col className="m-0 p-2">
          <Alert variant="warning" className="m-0 p-2">
            No tasks found
          </Alert>
        </Col>
      )}
      {tasks.map(task => (
        <Col xs={12} s={4} lg={4} key={task.name} className="p-2">
          <Card className="w-100 h-100 task-list-item">
            <Card.Header>
              <Card.Title>{task.name}</Card.Title>
            </Card.Header>
            <Card.Body>
              <Card.Text>
                {task.tagline.substr(0, 60)} <hr />
                <p>Due: {moment(new Date(task.due)).calendar()}</p>
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
