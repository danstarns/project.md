import React, { useState, useContext, useEffect } from "react";
import gql from "graphql-tag";
import { Row, Col, Button } from "react-bootstrap";
import ProjectForm from "./ProjectForm.js";
import { GraphQL } from "../../../contexts/index.js";
import { TitleBanner, LoadingBanner } from "../../Common/index.js";

const Query = gql`
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

const Mutation = gql`
  mutation editProject(
    $id: ID!
    $name: String!
    $tagline: String!
    $private: Boolean!
    $markdown: String!
    $due: String
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
          query: Query,
          variables
        });

        const { data = {}, errors } = response;

        if (errors && errors.length) {
          throw new Error(errors[0].message);
        }

        if (!data.project) {
          throw new Error(`Project not found`);
        }

        setProject(data.project);
      } catch (e) {
        setError(e.message);
      }

      setLoadingProject(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function submit(newProject) {
    setLoadingCreate(true);

    (async () => {
      try {
        const variables = {
          id: match.params.id,
          ...newProject
        };

        const response = await client.mutate({
          mutation: Mutation,
          variables
        });

        const { data = {}, errors } = response;

        if (errors && errors.length) {
          throw new Error(errors[0].message);
        }

        if (data.editProject.error) {
          throw new Error(data.editProject.error.message);
        }

        // eslint-disable-next-line no-underscore-dangle
        history.push(`/project/${data.editProject.data.project._id}`);
      } catch (e) {
        setError(e.message);
      }

      setLoadingCreate(false);
    })();
  }

  if (loadingProject) {
    return <LoadingBanner />;
  }

  return (
    <>
      <Row>
        <Col>
          <TitleBanner heading="Edit Project" />
        </Col>
      </Row>
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
    </>
  );
}

export default EditProject;
