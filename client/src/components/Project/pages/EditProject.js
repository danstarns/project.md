import React, { useState, useContext, useEffect, useCallback } from "react";
import gql from "graphql-tag";
import { Card } from "react-bootstrap";
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
      logo
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
    $logo: Upload
  ) {
    editProject(
      input: {
        id: $id
        name: $name
        tagline: $tagline
        private: $private
        markdown: $markdown
        due: $due
        logo: $logo
      }
    ) {
      _id
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

      setTimeout(() => {
        history.push(`/project/${data.editProject._id}`);
      }, 500);
    } catch (e) {
      setError(e.message);
    }
  }, []);

  if (loadingProject) {
    return <LoadingBanner />;
  }

  return (
    <div className="d-flex justify-content-center align-items-center">
      <Card className="p-3 w-100">
        <h1 className="m-0">Edit Project: {project.name}</h1>
        <hr />
        <ProjectForm
          onChange={submit}
          error={error}
          loading={loadingCreate}
          defaults={project}
          cancel={() => history.goBack()}
        />
      </Card>
    </div>
  );
}

export default EditProject;
