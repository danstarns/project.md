import React, { useState, useContext, useEffect } from "react";
import gql from "graphql-tag";
import { Button, Row, Col, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GraphQL, AuthContext } from "../../../contexts/index.js";
import { ErrorBanner, LoadingBanner } from "../../Common/index.js";
import { OrganizationsFilter, OrganizationList } from "../components/index.js";

const USER_ORGANIZATIONS_QUERY = gql`
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
        logo
        userCount
        projectCount
      }
    }
  }
`;

const PUBLIC_ORGANIZATIONS_QUERY = gql`
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
        logo
        userCount
        projectCount
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
          filter.selected === "user"
            ? USER_ORGANIZATIONS_QUERY
            : PUBLIC_ORGANIZATIONS_QUERY;

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
    <Card className="p-2 mb-3">
      <Row className="m-0 d-flex p-0 pb-1 px-2 mt-1">
        <h1 className="mr-auto mt-0">Organizations</h1>
        {isLoggedIn && (
          <Button
            className="mt-0"
            onClick={() => history.push("/organization/create")}
          >
            <p className="p-0 m-0">
              <FontAwesomeIcon icon="plus" className="mr-2" />
              Create
            </p>
          </Button>
        )}
      </Row>
      <Row className="m-0">
        <Col className="m-0 p-2">
          <OrganizationsFilter
            onChange={f => setFilter(f)}
            hasNextPage={hasNextPage}
          />
        </Col>
      </Row>
      <Row className="m-0">
        <Col className="m-0 p-0">
          <OrganizationList organizations={organizations} history={history} />
        </Col>
      </Row>
    </Card>
  );
}

export default Organizations;
