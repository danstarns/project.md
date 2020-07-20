import React, { useState, useContext, useCallback } from "react";
import gql from "graphql-tag";
import { Card } from "react-bootstrap";
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
    <div className="d-flex justify-content-center align-items-center">
      <Card className="p-3 w-100">
        <h1 className="m-0">Create Project</h1>
        <hr />
        <ProjectForm
          onChange={submit}
          error={error}
          loading={loading}
          defaults={{
            due: new Date(),
            markdown: `# My Project \n look at my super cool project 🍺`
          }}
          cancel={() => history.goBack()}
        />
      </Card>
    </div>
  );
}

export default CreateProject;
