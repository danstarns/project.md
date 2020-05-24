import React, { useState, useContext } from "react";
import gql from "graphql-tag";
import { Row, Col } from "react-bootstrap";
import { GraphQL } from "../../../../contexts/index.js";
import ProjectForm from "../ProjectForm.js";
import { TitleBanner } from "../../../Common/index.js";

const Mutation = gql`
  mutation createProject(
    $name: String!
    $tagline: String!
    $private: Boolean!
    $due: String!
    $markdown: String!
  ) {
    createProject(
      input: {
        name: $name
        tagline: $tagline
        private: $private
        due: $due
        markdown: $markdown
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

function CreateProject({ history }) {
  const { client } = useContext(GraphQL.Context);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function submit(project) {
    setLoading(true);

    try {
      setError(null);

      const variables = {
        name: project.name,
        tagline: project.tagline,
        private: Boolean(project.private),
        markdown: project.markdown,
        due: project.due.toISOString()
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

      // eslint-disable-next-line no-underscore-dangle
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
