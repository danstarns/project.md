import React, { useContext, useEffect, useState } from "react";
import gql from "graphql-tag";
import { Row, Col, Button } from "react-bootstrap";
import { LoadingBanner, TitleBanner, ErrorBanner } from "../../Common/index.js";
import { GraphQL, AuthContext } from "../../../contexts/index.js";
import { TaskForm } from "../components/index.js";

const Query = gql`
  query task($id: ID!) {
    task(id: $id) {
      _id
      name
      tagline
      markdown
      due
    }
  }
`;

const Mutation = gql`
  mutation editTask(
    $id: ID!
    $name: String!
    $tagline: String!
    $markdown: String!
    $due: String!
  ) {
    editTask(
      input: {
        id: $id
        name: $name
        tagline: $tagline
        markdown: $markdown
        due: $due
      }
    ) {
      error {
        message
      }
      data {
        task {
          _id
        }
      }
    }
  }
`;

function EditTask({ match, history }) {
  const { client } = useContext(GraphQL.Context);
  const { isLoggedIn } = useContext(AuthContext.Context);
  const [LoadingTask, setLoadingTask] = useState(true);
  const [error, setError] = useState(false);
  const [task, setTask] = useState(false);
  const [loadingCreate, setLoadingCreate] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const variables = {
          id: match.params.id
        };

        const response = await client.query({
          query: Query,
          variables,
          fetchPolicy: "no-cache"
        });

        const { data = {}, errors } = response;

        if (errors && errors.length) {
          throw new Error(errors[0].message);
        }

        if (!data.task) {
          throw new Error(`Task not found`);
        }

        setTask(data.task);
      } catch (e) {
        setError(e.message);
      }

      setLoadingTask(false);
    })();
  }, []);

  if (!isLoggedIn) {
    return <ErrorBanner error="Must be logged in to edit a task" />;
  }

  function submit(newTask) {
    setLoadingCreate(true);

    (async () => {
      try {
        const variables = {
          id: match.params.id,
          ...newTask
        };

        const response = await client.mutate({
          mutation: Mutation,
          variables
        });

        const { data = {}, errors } = response;

        if (errors && errors.length) {
          throw new Error(errors[0].message);
        }

        if (data.editTask.error) {
          throw new Error(data.editTask.error.message);
        }

        history.push(`/task/${data.editTask.data.task._id}`);
      } catch (e) {
        setError(e.message);
      }

      setLoadingCreate(false);
    })();
  }

  if (LoadingTask) {
    return <LoadingBanner />;
  }

  return (
    <>
      <Row>
        <Col>
          <TitleBanner heading="Edit Task" />
        </Col>
      </Row>
      <Row>
        <Col>
          <TaskForm
            onChange={submit}
            error={error}
            loading={loadingCreate}
            defaults={task}
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

export default EditTask;
