import React, { useContext, useState, useEffect } from "react";
import gql from "graphql-tag";
import { Col, Row, Card, Tab, Tabs, Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GraphQL, AuthContext } from "../../../contexts/index.js";
import { Markdown } from "../../Markdown/index.js";
import { ErrorBanner, LoadingBanner } from "../../Common/index.js";
import { ProjectList, ProjectFilter } from "../../Project/index.js";
import {
  InviteUserModal,
  OrganizationChat,
  AssignAdminModal
} from "../components/index.js";
import { UserListCards } from "../../User/index";

const ORGANIZATION_QUERY = gql`
  query organization(
    $id: ID!
    $page: Int!
    $limit: Int!
    $search: String
    $sort: String!
    $user: Boolean
  ) {
    organization(id: $id) {
      _id
      name
      tagline
      markdown
      isUserAdmin
      userCanChat
      logo
      users {
        _id
        username
        profilePic
      }
      admins {
        _id
        username
        profilePic
      }
      creator {
        _id
        username
        profilePic
      }
      projects(
        input: {
          page: $page
          limit: $limit
          search: $search
          sort: $sort
          user: $user
        }
      ) {
        hasNextPage
        projects {
          _id
          name
          tagline
          due
          private
        }
      }
    }
  }
`;

function Organization({ match, history }) {
  const { client } = useContext(GraphQL.Context);
  const { isLoggedIn } = useContext(AuthContext.Context);
  const [organization, setOrganization] = useState();
  const [error, setError] = useState();
  const [projectFilter, setProjectsFilter] = useState({
    selected: isLoggedIn ? "user" : "public",
    dateDirection: "desc",
    search: "",
    page: 1,
    limit: 6
  });
  const [projects, setProjects] = useState([]);
  const [hasNextProjects, setHasNextProjects] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isInviteUserModal, setIsInviteUserModal] = useState(false);
  const [isAssignAdminModal, setIsAssignAdminModal] = useState(false);
  const [key, setKey] = useState("markdown");

  useEffect(() => {
    (async () => {
      try {
        const { data, errors } = await client.query({
          query: ORGANIZATION_QUERY,
          variables: {
            id: match.params.id,
            page: projectFilter.page,
            limit: projectFilter.limit,
            sort: projectFilter.dateDirection,
            search: projectFilter.search,
            ...(projectFilter.selected === "user"
              ? { user: true }
              : { user: false })
          },
          fetchPolicy: "no-cache"
        });

        if (errors && errors.length) {
          throw new Error(errors[0].message);
        }

        if (!data.organization) {
          history.push("/");
        }

        setProjects(data.organization.projects.projects);
        setHasNextProjects(data.organization.projects.hasNextPage);
        setOrganization(data.organization);
      } catch (e) {
        setError(e.message);
      }

      setLoading(false);
    })();
  }, [projectFilter]);

  if (error) {
    return <ErrorBanner error={error} />;
  }

  if (loading) {
    return <LoadingBanner />;
  }

  return (
    <div className="pb-3">
      <AssignAdminModal
        show={isAssignAdminModal}
        onHide={() => setIsAssignAdminModal(false)}
        organization={organization}
      />
      <InviteUserModal
        show={isInviteUserModal}
        onHide={() => setIsInviteUserModal(false)}
        organization={organization}
      />
      <div className="d-flex justify-content-center align-items-center flex-column">
        <h1 className="mt-3 mb-0 text-center">{organization.name}</h1>
        <p className="ml-1 mt-0 font-italic text-center">
          {organization.tagline}
        </p>
        <Card className="p-3 d-flex justify-content-between align-items-center">
          <Card className="organization-logo">
            {organization.logo ? (
              <img
                className="organization-logo"
                src={organization.logo}
                alt="Profile Pic"
              />
            ) : (
              <div className="organization-logo-icon">
                <FontAwesomeIcon icon="building" size="6x" />
              </div>
            )}
          </Card>
          <div className="d-flex justify-content-between align-items-center pt-2">
            {organization.isUserAdmin && (
              <Dropdown className="m-1">
                <Dropdown.Toggle
                  variant="outline-secondary"
                  id="dropdown-basic"
                >
                  <FontAwesomeIcon
                    icon="user-shield"
                    size="1x"
                    className="mr-2"
                  />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() =>
                      history.push(`/organization/edit/${match.params.id}`)
                    }
                  >
                    Edit
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setIsInviteUserModal(true)}>
                    Invite User
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setIsAssignAdminModal(true)}>
                    Assign Admin
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() =>
                      history.push(`/project/create/${match.params.id}`)
                    }
                  >
                    Create Project
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
            {organization.userCanChat && (
              <Dropdown className="m-1">
                <Dropdown.Toggle variant="outline-info" id="dropdown-basic">
                  <FontAwesomeIcon icon="cog" size="1x" className="mr-2" />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() =>
                      history.push(`/organization/edit/${match.params.id}`)
                    }
                  >
                    Leave
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}
          </div>
        </Card>
      </div>
      <Tabs
        activeKey={key}
        onSelect={k => setKey(k)}
        className="mt-3"
        unmountOnExit
      >
        <Tab
          eventKey="markdown"
          title={
            <FontAwesomeIcon
              icon={["fab", "markdown"]}
              size="2x"
              color="black"
            />
          }
        >
          <Card className="p-3 mt-3">
            <Markdown markdown={organization.markdown} />
          </Card>
        </Tab>
        <Tab
          eventKey="projects"
          title={<FontAwesomeIcon icon="clipboard" size="2x" color="black" />}
        >
          <Card className="p-2 mt-3">
            <Row className="m-0">
              <Col className="m-0 p-2">
                <ProjectFilter
                  onChange={setProjectsFilter}
                  hasNextPage={hasNextProjects}
                />
              </Col>
            </Row>
            <Row className="m-0 mb-2">
              <Col className="m-0 p-0">
                <ProjectList projects={projects} history={history} />
              </Col>
            </Row>
          </Card>
        </Tab>
        <Tab
          eventKey="users"
          title={<FontAwesomeIcon icon="users" size="2x" color="black" />}
        >
          <Card className="p-3 mt-3">
            <UserListCards
              users={[
                ...(organization.users || []),
                ...(organization.admins || []),
                ...(organization.creator ? [organization.creator] : [])
              ]}
            />
          </Card>
        </Tab>
        <Tab
          eventKey="chat"
          title={
            <FontAwesomeIcon icon="comment-dots" size="2x" color="black" />
          }
        >
          <Card className="p-0 mt-3">
            <OrganizationChat organization={organization} />
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}

export default Organization;
