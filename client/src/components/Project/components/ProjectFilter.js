import React, { useState, useEffect, useContext, useCallback } from "react";
import { Row, Col, ListGroup, Form, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AuthContext } from "../../../contexts/index.js";

const selectedStyle = {
  backgroundColor: "#077bff",
  color: "white"
};

function ProjectsFilter(props) {
  const { isLoggedIn } = useContext(AuthContext.Context);
  const [selected, setSelected] = useState(isLoggedIn ? "user" : "public");
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

  const updatePage = useCallback(
    direction => () => {
      if (direction === "back") {
        setPage(p => p - 1);
      } else {
        setPage(p => p + 1);
      }
    },
    []
  );

  return (
    <Row>
      <Col className="d-flex justify-content-center">
        <ListGroup horizontal className="w-100 project-filter">
          {isLoggedIn && (
            <ListGroup.Item
              onClick={() => setSelected("user")}
              className="d-flex justify-content-center align-items-center p-3 project-filter-card w-30"
              style={{
                ...(selected === "user" ? selectedStyle : {})
              }}
            >
              <p className="m-0">Mine</p>
            </ListGroup.Item>
          )}
          <ListGroup.Item
            onClick={() => setSelected("public")}
            className="d-flex justify-content-center align-items-center project-filter-card w-30"
            style={{
              ...(selected === "public" ? selectedStyle : {})
            }}
          >
            <p className="m-0">Public</p>
          </ListGroup.Item>
          <ListGroup.Item
            className="d-flex flex-row justify-content-center align-items-center project-filter-card-date w-30"
            onClick={updateDirection}
          >
            <p className="m-0">Created</p>
            {dateDirection === "desc" ? (
              <FontAwesomeIcon icon="sort-down" className="ml-2" size="1x" />
            ) : (
              <FontAwesomeIcon icon="sort-up" className="ml-2" size="1x" />
            )}
          </ListGroup.Item>
          <ListGroup.Item className="d-flex justify-content-center align-items-center p-0 w-100">
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
          <ListGroup.Item className="d-flex justify-content-center align-items-center w-30">
            <Col>
              {page > 1 ? (
                <FontAwesomeIcon
                  icon="chevron-left"
                  size="2x"
                  onClick={updatePage("back")}
                  className="project-filter-card-arrow mx-auto"
                />
              ) : (
                <FontAwesomeIcon icon="ban" size="2x" />
              )}
            </Col>
            <Col>
              {props.hasNextPage ? (
                <FontAwesomeIcon
                  icon="chevron-right"
                  size="2x"
                  onClick={updatePage("next")}
                  className="project-filter-card-arrow mx-auto"
                />
              ) : (
                <FontAwesomeIcon icon="ban" size="2x" />
              )}
            </Col>
          </ListGroup.Item>
        </ListGroup>
      </Col>
    </Row>
  );
}

export default ProjectsFilter;
