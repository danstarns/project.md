import React, { useState, useContext, useEffect, useCallback } from "react";
import gql from "graphql-tag";
import { Row, Col, Button } from "react-bootstrap";
import { ProjectForm } from "../components/index.js";
import { GraphQL } from "../../../contexts/index.js";
import { LoadingBanner } from "../../Common/index.js";

const PROJECT_QUERY = gql`
  query project($id: ID!) {
    project(id: $id) {
      _id
      name
      tagline
      private
      markdown
      private
      due
    }
  }
`;

const EDIT_PROJECT_MUTATION = gql`
  mutation editProject(
    $id: ID!
    $name: String!
    $tagline: String!
    $private: Boolean!
    $markdown: String!
    $due: String!
  ) {
    editProject(
      input: {
        id: $id
        name: $name
        tagline: $tagline
        private: $private
        markdown: $markdown
        due: $due
      }
    ) {
      error {
        message
      }
      data {
        project {
          _id
        }
      }
    }
  }
`;

function EditProject({ match, history }) {
  const { client } = useContext(GraphQL.Context);
  const [loadingProject, setLoadingProject] = useState(true);
  const [error, setError] = useState(false);
  const [project, setProject] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const variables = {
          id: match.params.id
        };

        const response = await client.query({
          query: PROJECT_QUERY,
          variables,
          fetchPolicy: "no-cache"
        });

        const { data = {}, errors } = response;

        if (errors && errors.length) {
          throw new Error(errors[0].message);
        }

        if (!data.project) {
          throw new Error(`Project not found`);
        }

        setProject(data.project);

        setTimeout(() => {
          setLoadingProject(false);
        }, 500);
      } catch (e) {
        setError(e.message);
      }

      setLoadingProject(false);
    })();
  }, []);

  const submit = useCallback(async newProject => {
    setLoadingCreate(true);

    try {
      const variables = {
        id: match.params.id,
        ...newProject
      };

      const response = await client.mutate({
        mutation: EDIT_PROJECT_MUTATION,
        variables
      });

      const { data = {}, errors } = response;

      if (errors && errors.length) {
        throw new Error(errors[0].message);
      }

      if (data.editProject.error) {
        throw new Error(data.editProject.error.message);
      }

      setTimeout(() => {
        history.push(`/project/${data.editProject.data.project._id}`);
      }, 500);
    } catch (e) {
      setError(e.message);
    }
  }, []);

  if (loadingProject) {
    return <LoadingBanner />;
  }

  return (
    <div>
      <h1>Edit Project: {project.name}</h1>
      <Row>
        <Col>
          <ProjectForm
            onChange={submit}
            error={error}
            loading={loadingCreate}
            defaults={project}
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

export default EditProject;
