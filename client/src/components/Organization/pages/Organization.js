import React, { useContext, useState, useEffect } from "react";
import gql from "graphql-tag";
import { Col, Row, Button, Card } from "react-bootstrap";
import { GraphQL, AuthContext } from "../../../contexts/index.js";
import { Markdown } from "../../Markdown/index.js";
import { ErrorBanner, LoadingBanner } from "../../Common/index.js";
import { ProjectList, ProjectFilter } from "../../Project/index.js";
import { InviteUserModal } from "../components/index.js";
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
        username
      }
      admins {
        username
      }
      creator {
        username
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

        {organization.isUserAdmin && (
          <Card className="p-3 mt-3">
            <div className="d-flex align-items-start">
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
            </div>
          </Card>
        )}
      </section>

      <section>
        <Card className="p-3 mt-3">
          <h1 className="m-0">Projects</h1>
          <hr />

          <Row>
            <Col sm={12} md={12} lg={2}>
              {isLoggedIn && (
                <Button
                  className="mt-3 mb-3 w-100"
                  onClick={() =>
                    history.push(`/project/create/${match.params.id}`)
                  }
                >
                  Create Project
                </Button>
              )}

              <ProjectFilter onChange={setProjectsFilter} />
            </Col>

            <Col sm={12} md={12} lg={10} className="mt-3">
              <ProjectList
                projects={projects}
                history={history}
                hasNextPage={hasNextProjects}
              />
            </Col>
          </Row>
        </Card>
      </section>

      <section>
        <Card className="p-3 mt-3">
          <h1 className="m-0">Users</h1>
          <hr />
          <UserListCards
            users={[
              ...(organization.users || []),
              ...(organization.admins || []),
              ...(organization.creator ? [organization.creator] : [])
            ]}
          />
        </Card>
      </section>

      <section>
        <Card className="p-3 mt-3">
          <h1 className="m-0">Markdown</h1>
          <hr />
          <Markdown markdown={organization.markdown} />
        </Card>
      </section>
    </div>
  );
}

export default Organization;
