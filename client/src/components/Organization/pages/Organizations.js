import React, { useState, useContext, useEffect } from "react";
import gql from "graphql-tag";
import { Button, Row, Col, Jumbotron } from "react-bootstrap";
import { GraphQL, AuthContext } from "../../../contexts/index.js";
import { ErrorBanner, LoadingBanner } from "../../Common/index.js";
import { OrganizationsFilter, OrganizationList } from "../components/index.js";

const userOrganizations = gql`
  query userOrganizations(
    $page: Int!
    $limit: Int!
    $sort: DateSortEnum!
    $search: String
  ) {
    result: userOrganizations(
      input: { page: $page, limit: $limit, sort: $sort, search: $search }
    ) {
      hasNextPage
      organizations {
        _id
        name
        tagline
        private
        markdown
      }
    }
  }
`;

const publicOrganizations = gql`
  query publicOrganizations(
    $page: Int!
    $limit: Int!
    $sort: DateSortEnum!
    $search: String
  ) {
    result: publicOrganizations(
      input: { page: $page, limit: $limit, sort: $sort, search: $search }
    ) {
      hasNextPage
      organizations {
        _id
        name
        tagline
        private
        markdown
      }
    }
  }
`;

function Organizations({ history }) {
  const { client } = useContext(GraphQL.Context);
  const { isLoggedIn } = useContext(AuthContext.Context);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [filter, setFilter] = useState({
    selected: isLoggedIn ? "user" : "public",
    dateDirection: "desc",
    search: "",
    page: 1,
    limit: 6
  });

  useEffect(() => {
    (async () => {
      try {
        const query =
          filter.selected === "user" ? userOrganizations : publicOrganizations;

        const {
          data: { result }
        } = await client.query({
          query,
          variables: {
            page: filter.page,
            limit: filter.limit,
            sort: filter.dateDirection,
            search: filter.search
          },
          fetchPolicy: "no-cache"
        });

        setError(false);
        setOrganizations(result.organizations);
        setHasNextPage(result.hasNextPage);
      } catch (e) {
        setError(e.message);
      }

      setLoading(false);
    })();
  }, [filter]);

  if (error) {
    return <ErrorBanner error={error} />;
  }

  if (loading) {
    return <LoadingBanner />;
  }

  return (
    <>
      <h1 className="mt-3">Organizations</h1>

      <hr />

      <Row>
        <Col sm={12} md={12} lg={2}>
          {isLoggedIn && (
            <Button
              className="mt-3 mb-3 w-100"
              onClick={() => history.push("/organization/create")}
            >
              Create
            </Button>
          )}
          <OrganizationsFilter onChange={setFilter} hasNextPage={hasNextPage} />
        </Col>
        <Col sm={12} md={12} lg={10} className="mt-3">
          <OrganizationList organizations={organizations} history={history} />
        </Col>
      </Row>

      {isLoggedIn && (
        <>
          <hr />

          <Row className="mt-3">
            <Col>
              <Jumbotron>
                <h1>Recents</h1>
              </Jumbotron>
            </Col>
            <Col>
              <Jumbotron>
                <h1>Events</h1>
              </Jumbotron>
            </Col>
          </Row>
        </>
      )}
    </>
  );
}

export default Organizations;
