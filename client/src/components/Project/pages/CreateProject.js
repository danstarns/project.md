import React, { useState, useContext, useCallback } from "react";
import gql from "graphql-tag";
import { Row, Col, Button } from "react-bootstrap";
import { GraphQL } from "../../../contexts/index.js";
import { ProjectForm } from "../components/index.js";

const CREATE_PROJECT_MUTATION = gql`
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const submit = useCallback(async project => {
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
        mutation: CREATE_PROJECT_MUTATION,
        variables,
        fetchPolicy: "no-cache"
      });

      const { data: { createProject = {} } = {} } = response;

      if (createProject.error) {
        throw new Error(createProject.error.message);
      }

      setTimeout(() => {
        history.push(`/project/${createProject.project._id}`);
      }, 500);
    } catch (e) {
      setError(e.message);
    }
  }, []);

  return (
    <div>
      <h1>Create Project</h1>
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
          <Button
            block
            variant="warning"
            onClick={() => history.goBack()}
            className="mb-3"
          >
            Cancel
          </Button>
        </Col>
      </Row>
    </div>
  );
}

export default CreateProject;
