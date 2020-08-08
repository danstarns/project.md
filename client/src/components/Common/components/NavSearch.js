/* eslint-disable react/no-unescaped-entities */
import React, { useState, useCallback, useContext, useEffect } from "react";
import {
  Button,
  Modal,
  Spinner,
  ListGroup,
  Alert,
  Row,
  Col
} from "react-bootstrap";
import { DebounceInput } from "react-debounce-input";
import gql from "graphql-tag";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { GraphQL } from "../../../contexts/index.js";

const PROJECTS_QUERY = gql`
  query projects(
    $page: Int!
    $limit: Int!
    $sort: DateSortEnum!
    $search: String
  ) {
    result: projects(
      input: { page: $page, limit: $limit, sort: $sort, search: $search }
    ) {
      hasNextPage
      projects {
        _id
        name
        logo
      }
    }
  }
`;

const ORGANIZATIONS_QUERY = gql`
  query organizations(
    $page: Int!
    $limit: Int!
    $sort: DateSortEnum!
    $search: String
  ) {
    result: organizations(
      input: { page: $page, limit: $limit, sort: $sort, search: $search }
    ) {
      hasNextPage
      organizations {
        _id
        name
        logo
      }
    }
  }
`;

const TASKS_QUERY = gql`
  query tasks($page: Int!, $limit: Int!, $search: String) {
    result: tasks(input: { page: $page, limit: $limit, search: $search }) {
      hasNextPage
      tasks {
        _id
        name
      }
    }
  }
`;

const USERS_QUERY = gql`
  query users($page: Int!, $limit: Int!, $search: String) {
    result: users(input: { page: $page, limit: $limit, search: $search }) {
      hasNextPage
      users {
        _id
        username
        profilePic
      }
    }
  }
`;

function Loading(props) {
  return (
    <section>
      <h5 className="m-2">{props.type}</h5>
      <div className="d-flex justify-content-center align-items-center pb-5">
        <Spinner animation="border" className="ml-3 mt-5" />
      </div>
    </section>
  );
}

function Users(props) {
  const { client } = useContext(GraphQL.Context);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  const getUsers = useCallback(async () => {
    setLoading(true);

    try {
      const response = await client.query({
        query: USERS_QUERY,
        variables: {
          search: props.search,
          page,
          limit: 5
        },
        fetchPolicy: "no-cache"
      });

      if (!response.data) {
        // TODO handle this
        return;
      }

      setUsers(response.data.result.users);
      setHasNextPage(response.data.result.hasNextPage);
    } catch (error) {
      // TODO handle this
    }

    setLoading(false);
  }, [page, props.search]);

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    getUsers();
  }, [page]);

  if (loading) {
    return <Loading type="Users" />;
  }

  return (
    <div className="w-100">
      <h5 className="m-0 mt-2 mb-2">Users</h5>
      {users.length ? (
        <>
          <ListGroup>
            {users.map(user => (
              <ListGroup.Item key={user._id} className="d-flex p-1">
                {user.profilePic ? (
                  <img
                    className="navbar-search-pic"
                    src={user.profilePic}
                    alt="logo"
                  />
                ) : (
                  <div className="navbar-search-pic">
                    <FontAwesomeIcon icon="user" size="1x" />
                  </div>
                )}
                <Link
                  className="ml-3"
                  to={`/profile/${user._id}`}
                  onClick={() => {
                    props.onHide();
                  }}
                >
                  {user.username}
                </Link>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <div className="d-flex justify-content-end align-items-center mt-2">
            {page > 1 && (
              <Button
                size="sm"
                className="mr-2"
                variant="outline-secondary"
                onClick={() => setPage(p => p - 1)}
              >
                Back
              </Button>
            )}
            {hasNextPage && (
              <Button
                size="sm"
                variant="outline-primary"
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </Button>
            )}
          </div>
        </>
      ) : (
        <ListGroup>
          <ListGroup.Item className="p-0">
            <Alert variant="info" className="m-0 w-100 h-100">
              No users found
            </Alert>
          </ListGroup.Item>
        </ListGroup>
      )}
    </div>
  );
}

function Tasks(props) {
  const { client } = useContext(GraphQL.Context);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  const getTasks = useCallback(async () => {
    setLoading(true);

    try {
      const response = await client.query({
        query: TASKS_QUERY,
        variables: {
          search: props.search,
          page,
          limit: 5
        },
        fetchPolicy: "no-cache"
      });

      if (!response.data) {
        // TODO handle this
        return;
      }

      setTasks(response.data.result.tasks);
      setHasNextPage(response.data.result.hasNextPage);
    } catch (error) {
      // TODO handle this
    }

    setLoading(false);
  }, [page, props.search]);

  useEffect(() => {
    getTasks();
  }, []);

  useEffect(() => {
    getTasks();
  }, [page]);

  if (loading) {
    return <Loading type="Tasks" />;
  }

  return (
    <div className="w-100">
      <h5 className="m-0 mt-2 mb-2">Tasks</h5>
      {tasks.length ? (
        <>
          <ListGroup>
            {tasks.map(task => (
              <ListGroup.Item key={task._id} className="d-flex p-1">
                <div className="navbar-search-pic">
                  <div className="navbar-search-pic">
                    <FontAwesomeIcon icon="sticky-note" size="1x" />
                  </div>
                </div>
                <Link
                  className="ml-3"
                  to={`/task/${task._id}`}
                  onClick={() => {
                    props.onHide();
                  }}
                >
                  {task.name}
                </Link>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <div className="d-flex justify-content-end align-items-center mt-2">
            {page > 1 && (
              <Button
                size="sm"
                className="mr-2"
                variant="outline-secondary"
                onClick={() => setPage(p => p - 1)}
              >
                Back
              </Button>
            )}
            {hasNextPage && (
              <Button
                size="sm"
                variant="outline-primary"
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </Button>
            )}
          </div>
        </>
      ) : (
        <ListGroup>
          <ListGroup.Item className="p-0">
            <Alert variant="info" className="m-0 w-100 h-100">
              No tasks found
            </Alert>
          </ListGroup.Item>
        </ListGroup>
      )}
    </div>
  );
}

function Organizations(props) {
  const { client } = useContext(GraphQL.Context);
  const [loading, setLoading] = useState(true);
  const [organizations, setOrganizations] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  const getOrganizations = useCallback(async () => {
    setLoading(true);

    try {
      const response = await client.query({
        query: ORGANIZATIONS_QUERY,
        variables: {
          search: props.search,
          page,
          sort: "asc",
          limit: 5
        },
        fetchPolicy: "no-cache"
      });

      if (!response.data) {
        // TODO handle this
        return;
      }

      setOrganizations(response.data.result.organizations);
      setHasNextPage(response.data.result.hasNextPage);
    } catch (error) {
      // TODO handle this
    }

    setLoading(false);
  }, [page, props.search]);

  useEffect(() => {
    getOrganizations();
  }, []);

  useEffect(() => {
    getOrganizations();
  }, [page]);

  if (loading) {
    return <Loading type="Organizations" />;
  }

  return (
    <div className="w-100">
      <h5 className="m-0 mt-2 mb-2">Organizations</h5>
      {organizations.length ? (
        <>
          <ListGroup>
            {organizations.map(org => (
              <ListGroup.Item key={org._id} className="d-flex p-1">
                <div className="navbar-search-pic">
                  {org.logo ? (
                    <img
                      className="navbar-search-pic"
                      src={org.logo}
                      alt="logo"
                    />
                  ) : (
                    <div className="navbar-search-pic">
                      <FontAwesomeIcon icon="building" size="1x" />
                    </div>
                  )}
                </div>
                <Link
                  className="ml-3"
                  to={`/organization/${org._id}`}
                  onClick={() => {
                    props.onHide();
                  }}
                >
                  {org.name}
                </Link>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <div className="d-flex justify-content-end align-items-center mt-2">
            {page > 1 && (
              <Button
                size="sm"
                className="mr-2"
                variant="outline-secondary"
                onClick={() => setPage(p => p - 1)}
              >
                Back
              </Button>
            )}
            {hasNextPage && (
              <Button
                size="sm"
                variant="outline-primary"
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </Button>
            )}
          </div>
        </>
      ) : (
        <ListGroup>
          <ListGroup.Item className="p-0">
            <Alert variant="info" className="m-0 w-100 h-100">
              No organizations found
            </Alert>
          </ListGroup.Item>
        </ListGroup>
      )}
    </div>
  );
}

function Projects(props) {
  const { client } = useContext(GraphQL.Context);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);

  const getProjects = useCallback(async () => {
    setLoading(true);

    try {
      const response = await client.query({
        query: PROJECTS_QUERY,
        variables: {
          search: props.search,
          page,
          sort: "asc",
          limit: 5
        },
        fetchPolicy: "no-cache"
      });

      if (!response.data) {
        // TODO handle this
        return;
      }

      setProjects(response.data.result.projects);
      setHasNextPage(response.data.result.hasNextPage);
    } catch (error) {
      // TODO handle this
    }

    setLoading(false);
  }, [page, props.search]);

  useEffect(() => {
    getProjects();
  }, []);

  useEffect(() => {
    getProjects();
  }, [page]);

  if (loading) {
    return <Loading type="Projects" />;
  }

  return (
    <div className="w-100">
      <h5 className="m-0 mt-2 mb-2">Projects</h5>
      {projects.length ? (
        <>
          <ListGroup>
            {projects.map(proj => (
              <ListGroup.Item key={proj._id} className="d-flex p-1">
                <div className="navbar-search-pic">
                  {proj.logo ? (
                    <img
                      className="navbar-search-pic"
                      src={proj.logo}
                      alt="logo"
                    />
                  ) : (
                    <div className="navbar-search-pic">
                      <FontAwesomeIcon icon="clipboard" size="1x" />
                    </div>
                  )}
                </div>
                <Link
                  className="ml-3"
                  to={`/project/${proj._id}`}
                  onClick={() => {
                    props.onHide();
                  }}
                >
                  {proj.name}
                </Link>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <div className="d-flex justify-content-end align-items-center mt-2">
            {page > 1 && (
              <Button
                size="sm"
                className="mr-2"
                variant="outline-secondary"
                onClick={() => setPage(p => p - 1)}
              >
                Back
              </Button>
            )}
            {hasNextPage && (
              <Button
                size="sm"
                variant="outline-primary"
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </Button>
            )}
          </div>
        </>
      ) : (
        <ListGroup>
          <ListGroup.Item className="p-0">
            <Alert variant="info" className="m-0 w-100 h-100">
              No projects found
            </Alert>
          </ListGroup.Item>
        </ListGroup>
      )}
    </div>
  );
}

function NavSearch(props) {
  const [search, setSearch] = useState(false);

  return (
    <>
      <Modal show={props.show} onHide={props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>{search}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0">
          <Row className="d-flex justify-content-between">
            <Col sm={12} md={6} lg={6}>
              <Organizations search={search} onHide={props.onHide} />
            </Col>
            <Col sm={12} md={6} lg={6}>
              <Projects search={search} onHide={props.onHide} />
            </Col>
          </Row>
          <Row className="d-flex justify-content-between">
            <Col sm={12} md={6} lg={6}>
              <Tasks search={search} onHide={props.onHide} />
            </Col>
            <Col sm={12} md={6} lg={6}>
              <Users search={search} onHide={props.onHide} />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="d-flex justify-content-center align-items-center w-100 p-0 m-0">
        <DebounceInput
          type="text"
          debounceTimeout={800}
          onChange={e => {
            if (e.target.value === "") {
              return;
            }

            setSearch(e.target.value);
            props.onOpen();
          }}
          value={search}
          aria-label="Small"
          aria-describedby="inputGroup-sizing-lg"
          placeholder="Search"
          className="form-control mr-2"
          onKeyPress={e => {
            if (e.key === "Enter") {
              setSearch(e.target.value);
              props.onOpen();
            }
          }}
        />
        <Button
          variant="outline-primary"
          onClick={props.onOpen}
          disabled={!search}
        >
          Search
        </Button>
      </div>
    </>
  );
}

export default NavSearch;
