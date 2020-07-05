import React, { useState, useContext, useEffect } from "react";
import { Card, Row, Col, Tab, Tabs } from "react-bootstrap";
import "../User.css";
import gql from "graphql-tag";
import { GraphQL } from "../../../contexts/index.js";
import { ErrorBanner, LoadingBanner } from "../../Common/index.js";

const ME_QUERY = gql`
  {
    me {
      username
      email
      profilePic {
        data
        mimetype
      }
    }
  }
`;

function Profile({ match }) {
  const { client } = useContext(GraphQL.Context);
  const [key, setKey] = useState("projects");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [profile, setProfile] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const response = await client.query({
          query: ME_QUERY,
          variables: {
            id: match.params.id
          }
        });

        if (response.errors && response.errors.length) {
          throw new Error(response.errors[0].message);
        }

        if (!response.data.me) {
          throw new Error("user not found");
        }

        setProfile(response.data.me);
      } catch (e) {
        setError(e.message);
      }

      setLoading(false);
    })();
  }, []);

  if (error) {
    return <ErrorBanner error={error} />;
  }

  if (loading) {
    return <LoadingBanner />;
  }

  return (
    <div>
      <Row className="mt-3">
        <Col xs={12} sm={12} md={3} lg={3}>
          <Card className="p-3">
            <Card className="profile-pic mb-3 mx-auto">
              <img
                className="profile-pic"
                src={`data:${profile.profilePic.mimetype};base64, ${profile.profilePic.data}`}
                alt="Profile Pic"
              />
            </Card>
            <p>Daniel</p>
            <p>DanielStarns@hotmail.com</p>
          </Card>
        </Col>
        <Col xs={4} sm={4} md={3} lg={3}>
          <Card>Total Organizations</Card>
        </Col>
        <Col xs={4} sm={4} md={3} lg={3}>
          <Card>Total Projects</Card>
        </Col>
        <Col xs={4} sm={4} md={3} lg={3}>
          <Card>Total Tasks</Card>
        </Col>
      </Row>

      <Tabs activeKey={key} onSelect={k => setKey(k)} className="mt-3">
        <Tab eventKey="projects" title="Projects">
          <Card className="p-3 mt-3">
            <h1>Projects</h1>
          </Card>
        </Tab>
        <Tab eventKey="organizations" title="Organizations">
          <Card className="p-3 mt-3">
            <h1>Organizations</h1>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}

export default Profile;
