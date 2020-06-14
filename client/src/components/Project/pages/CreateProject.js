import React, { useState, useContext } from "react";
import gql from "graphql-tag";
import { Row, Col } from "react-bootstrap";
import { GraphQL, AuthContext } from "../../../contexts/index.js";
import { ProjectForm } from "../components/index.js";
import { TitleBanner, ErrorBanner } from "../../Common/index.js";

const Mutation = gql`
  mutation createProject(
    $name: String!
    $tagline: String!
    $private: Boolean!
    $due: String!
    $markdown: String!
    $organization: ID
  ) {
    createProject(
      input: {
        name: $name
        tagline: $tagline
        private: $private
        due: $due
        markdown: $markdown
        organization: $organization
      }
    ) {
      error {
        message
      }
      project {
        _id
      }
    }
  }
`;

function CreateProject({ history, match }) {
  const { client } = useContext(GraphQL.Context);
  const { isLoggedIn } = useContext(AuthContext.Context);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  if (!isLoggedIn) {
    return <ErrorBanner error="Must be logged in to create a project" />;
  }

  async function submit(project) {
    setLoading(true);

    try {
      setError(null);

      const variables = {
        name: project.name,
        tagline: project.tagline,
        private: Boolean(project.private),
        markdown: project.markdown,
        due: project.due.toISOString(),
        organization: match.params.organization
      };

      const response = await client.mutate({
        mutation: Mutation,
        variables,
        fetchPolicy: "no-cache"
      });

      const { data: { createProject = {} } = {} } = response;

      if (createProject.error) {
        throw new Error(createProject.error.message);
      }

      history.push(`/project/${createProject.project._id}`);
    } catch (e) {
      setError(e.message);
    }

    setLoading(false);
  }

  return (
    <>
      <Row>
        <Col>
          <TitleBanner
            heading="Create Project"
            content={`Use projects to group tasks together, invite friends or
    colleagues and share with the world!`}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <ProjectForm
            onChange={submit}
            error={error}
            loading={loading}
            defaults={{
              due: new Date(),
              markdown: `# My Project \n look at my super cool project 🍺`
            }}
          />
        </Col>
      </Row>
    </>
  );
}

export default CreateProject;
