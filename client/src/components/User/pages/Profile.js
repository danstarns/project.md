import React, { useState, useContext, useEffect } from "react";
import { Tab, Tabs } from "react-bootstrap";
import "../User.css";
import gql from "graphql-tag";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GraphQL } from "../../../contexts/index.js";
import { ErrorBanner, LoadingBanner } from "../../Common/index.js";
import { OrganizationList } from "../../Organization/components/index.js";
import { ProfilePic, EditProfileModal } from "../components/index.js";
import { ProjectList } from "../../Project/index.js";

const USER_QUERY = gql`
  query($id: ID!) {
    user(id: $id) {
      username
      email
      profilePic
      isRequester
      projects {
        _id
        name
        tagline
        due
        private
      }
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

function Profile({ match, history }) {
  const { client } = useContext(GraphQL.Context);
  const [key, setKey] = useState("projects");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [profile, setProfile] = useState(false);
  const [editUserModal, setEditUserModal] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const response = await client.query({
          query: USER_QUERY,
          variables: {
            id: match.params.id
          },
          fetchPolicy: "no-cache"
        });

        if (response.errors && response.errors.length) {
          throw new Error(response.errors[0].message);
        }

        if (!response.data.user) {
          throw new Error("user not found");
        }

        setProfile(response.data.user);
      } catch (e) {
        setError(e.message);
      }

      setLoading(false);
    })();
  }, [match.params.id]);

  if (error) {
    return <ErrorBanner error={error} />;
  }

  if (loading) {
    return <LoadingBanner />;
  }

  return (
    <div>
      <EditProfileModal
        show={editUserModal}
        onHide={() => setEditUserModal(false)}
        profile={profile}
        setProfile={p => setProfile(prof => ({ ...prof, ...p }))}
      />
      <div className="d-flex justify-content-center align-items-center flex-column">
        <ProfilePic
          profile={profile}
          setEditUserModal={() => setEditUserModal(true)}
        />
      </div>
      <div className="mt-2">
        <Tabs activeKey={key} onSelect={k => setKey(k)} className="p-2">
          <Tab
            eventKey="projects"
            title={
              <span className="profile-tab-numbers-icon">
                <FontAwesomeIcon icon="clipboard" size="2x" className="mr-2" />
                <strong>{profile.projects.length}</strong>
              </span>
            }
            className="p-0"
          >
            <ProjectList projects={profile.projects} history={history} />
          </Tab>
          <Tab
            eventKey="organizations"
            title={
              <span className="profile-tab-numbers-icon">
                <FontAwesomeIcon icon="building" size="2x" className="mr-2" />
                <strong>{profile.organizations.length}</strong>
              </span>
            }
            className="p-0"
          >
            <OrganizationList
              organizations={profile.organizations}
              history={history}
            />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}

export default Profile;
