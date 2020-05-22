import React, { useState, useEffect } from "react";
import { Row, Col, ListGroup, Form, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const selectedStyle = {
  backgroundColor: "#077bff",
  color: "white"
};

function ProjectsFilter(props) {
  const [selected, setSelected] = useState("user");
  const [dateDirection, setDateDirection] = useState("desc");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(6);

  function onChange() {
    props.onChange({ selected, dateDirection, search, page, limit });
  }

  useEffect(onChange, [selected, dateDirection, search, page, limit]);

  function updateDirection() {
    let newDirection;

    if (dateDirection === "desc") {
      newDirection = "asc";
    } else {
      newDirection = "desc";
    }

    setDateDirection(newDirection);
  }

  function updateSearch(e) {
    setSearch(e.target.value);
  }

  function updateSelected(type) {
    return () => {
      setSelected(type);
    };
  }

  function updatePage(direction) {
    return () => {
      let newPageNum;

      if (direction === "back") {
        newPageNum = page - 1;
      } else {
        newPageNum = page + 1;
      }

      setPage(newPageNum);
    };
  }

  return (
    <Row>
      <Col>
        <ListGroup>
          <ListGroup.Item
            onClick={updateSelected("user")}
            className="project-filter-card"
            style={{
              ...(selected === "user" ? selectedStyle : {})
            }}
          >
            My Projects
          </ListGroup.Item>
          <ListGroup.Item
            onClick={updateSelected("public")}
            className="project-filter-card"
            style={{
              ...(selected === "public" ? selectedStyle : {})
            }}
          >
            Public Projects
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
                  onChange={updateSearch}
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

export default ProjectsFilter;
