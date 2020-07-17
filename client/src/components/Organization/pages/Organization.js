import React, { useContext, useState, useEffect } from "react";
import gql from "graphql-tag";
import { Col, Row, Button, Card, Tab, Tabs } from "react-bootstrap";
import { GraphQL, AuthContext } from "../../../contexts/index.js";
import { Markdown } from "../../Markdown/index.js";
import { ErrorBanner, LoadingBanner } from "../../Common/index.js";
import { ProjectList, ProjectFilter } from "../../Project/index.js";
import { InviteUserModal, OrganizationChat } from "../components/index.js";
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
      users {
        _id
        username
        profilePic {
          mimetype
          data
        }
      }
      admins {
        _id
        username
        profilePic {
          mimetype
          data
        }
      }
      creator {
        _id
        username
        profilePic {
          mimetype
          data
        }
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
  const [key, setKey] = useState("chat");

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
      <section>
        <InviteUserModal
          show={isInviteUserModal}
          onHide={() => setIsInviteUserModal(false)}
          organization={organization}
        />
        <h1 className="mt-3 mb-0">Organization: {organization.name}</h1>
        <p className="ml-1 mt-0 font-italic">{organization.tagline}</p>
        {Boolean(organization.isUserAdmin || isLoggedIn) && (
          <Card className="p-3 mt-3">
            <div className="d-flex align-items-start">
              {organization.isUserAdmin && (
                <>
                  <Button
                    onClick={() =>
                      history.push(`/organization/edit/${match.params.id}`)
                    }
                  >
                    Edit
                  </Button>
                  <Button
                    className="ml-3"
                    onClick={() => setIsInviteUserModal(true)}
                  >
                    Invite User
                  </Button>
                </>
              )}

              {isLoggedIn && (
                <Button
                  className="ml-3"
                  onClick={() =>
                    history.push(`/project/create/${match.params.id}`)
                  }
                >
                  Create Project
                </Button>
              )}
            </div>
          </Card>
        )}
      </section>
      <Tabs activeKey={key} onSelect={k => setKey(k)} className="mt-3">
        <Tab eventKey="projects" title="Projects">
          <Card className="p-3 mt-3">
            <Row>
              <Col sm={12} md={12} lg={12}>
                <ProjectFilter
                  onChange={setProjectsFilter}
                  hasNextPage={hasNextProjects}
                />
              </Col>
              <Col sm={12} md={12} lg={12} className="pt-3">
                <ProjectList projects={projects} history={history} />
              </Col>
            </Row>
          </Card>
        </Tab>
        <Tab eventKey="users" title="Users">
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
        <Tab eventKey="chat" title="Chat">
          <Card className="p-0 mt-3">
            <OrganizationChat organization={match.params.id} />
          </Card>
        </Tab>
      </Tabs>
      <section className="mt-3">
        <Markdown markdown={organization.markdown} />
      </section>
    </div>
  );
}

export default Organization;
