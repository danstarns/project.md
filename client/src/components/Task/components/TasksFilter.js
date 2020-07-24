import React, { useState, useEffect, useContext, useCallback } from "react";
import { ListGroup, Form, Container } from "react-bootstrap";
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
    <ListGroup horizontal="md" className="w-100">
      {isLoggedIn && (
        <ListGroup.Item
          onClick={() => setSelected("user")}
          className="d-flex justify-content-center align-items-center p-3 task-filter-card w-30"
          style={{
            ...(selected === "user" ? selectedStyle : {})
          }}
        >
          <p className="m-0">Mine</p>
        </ListGroup.Item>
      )}
      <ListGroup.Item
        onClick={() => setSelected("all")}
        className="d-flex justify-content-center align-items-center task-filter-card w-30"
        style={{
          ...(selected === "all" ? selectedStyle : {})
        }}
      >
        <p className="m-0">All</p>
      </ListGroup.Item>
      <ListGroup.Item
        className="d-flex flex-row justify-content-center align-items-center task-filter-card-date w-30"
        onClick={updateDirection}
      >
        Date
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
        {page > 1 ? (
          <FontAwesomeIcon
            icon="chevron-left"
            size="2x"
            onClick={updatePage("back")}
            className="task-filter-card-arrow m-2"
          />
        ) : (
          <FontAwesomeIcon icon="ban" size="2x" className="m-2" />
        )}
        {props.hasNextPage ? (
          <FontAwesomeIcon
            icon="chevron-right"
            size="2x"
            onClick={updatePage("next")}
            className="task-filter-card-arrow m-2"
          />
        ) : (
          <FontAwesomeIcon icon="ban" size="2x" className="m-2" />
        )}
      </ListGroup.Item>
    </ListGroup>
  );
}

export default TasksFilter;
