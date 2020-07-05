import React, { useState, useEffect, useContext, useCallback } from "react";
import { Row, Col, ListGroup, Form, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AuthContext } from "../../../contexts/index.js";

const selectedStyle = {
  backgroundColor: "#077bff",
  color: "white"
};

function TasksFilter(props) {
  const { isLoggedIn } = useContext(AuthContext.Context);
  const [selected, setSelected] = useState(isLoggedIn ? "user" : "all");
  const [dateDirection, setDateDirection] = useState("desc");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(6);

  useEffect(() => {
    props.onChange({ selected, dateDirection, search, page, limit });
  }, [selected, dateDirection, search, page, limit]);

  const updateDirection = useCallback(() => {
    setDateDirection(d => {
      if (d === "desc") {
        return "asc";
      }
      return "desc";
    });
  }, []);

  const updatePage = useCallback(direction => {
    return () => {
      setPage(p => {
        if (direction === "back") {
          return p - 1;
        }
        return p + 1;
      });
    };
  }, []);

  return (
    <Row>
      <Col>
        <ListGroup>
          {isLoggedIn && (
            <ListGroup.Item
              onClick={() => setSelected("user")}
              className="project-filter-card"
              style={{
                ...(selected === "user" ? selectedStyle : {})
              }}
            >
              Mine
            </ListGroup.Item>
          )}
          <ListGroup.Item
            onClick={() => setSelected("all")}
            className="project-filter-card"
            style={{
              ...(selected === "all" ? selectedStyle : {})
            }}
          >
            All
          </ListGroup.Item>
          <ListGroup.Item className="p-0">
            <Container>
              <Form.Group>
                <Form.Control
                  size="md"
                  type="text"
                  placeholder="Search"
                  className="mt-3"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </Form.Group>
            </Container>
          </ListGroup.Item>
          <ListGroup.Item
            className="project-filter-card-date"
            onClick={updateDirection}
          >
            Date
            {dateDirection === "desc" ? (
              <FontAwesomeIcon
                icon="sort-down"
                className="ml-2 float-right"
                size="2x"
              />
            ) : (
              <FontAwesomeIcon
                icon="sort-up"
                className="ml-2 float-right"
                size="2x"
              />
            )}
          </ListGroup.Item>
          {props.hasNextPage && page !== 1 && (
            <ListGroup.Item>
              <Container>
                <Row className="text-center">
                  <Col
                    onClick={updatePage("back")}
                    xm={6}
                    sm={6}
                    md={6}
                    lg={6}
                    className="project-filter-card-arrow"
                  >
                    {page > 1 && (
                      <FontAwesomeIcon icon="chevron-left" size="2x" />
                    )}
                  </Col>
                  <Col
                    onClick={updatePage("next")}
                    xm={6}
                    sm={6}
                    md={6}
                    lg={6}
                    className="project-filter-card-arrow"
                  >
                    {props.hasNextPage && (
                      <FontAwesomeIcon icon="chevron-right" size="2x" />
                    )}
                  </Col>
                </Row>
              </Container>
            </ListGroup.Item>
          )}
        </ListGroup>
      </Col>
    </Row>
  );
}

export default TasksFilter;
