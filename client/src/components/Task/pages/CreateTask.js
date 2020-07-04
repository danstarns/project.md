import React, { useState, useContext, useCallback } from "react";
import gql from "graphql-tag";
import { GraphQL } from "../../../contexts/index.js";
import { TaskForm } from "../components/index.js";

const CREATE_TASK_MUTATION = gql`
  mutation createTask(
    $name: String!
    $tagline: String!
    $due: String!
    $markdown: String!
    $project: ID!
  ) {
    createTask(
      input: {
        name: $name
        tagline: $tagline
        due: $due
        markdown: $markdown
        project: $project
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

function CreateTask({ history, match }) {
  const { client } = useContext(GraphQL.Context);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = useCallback(async task => {
    setLoading(true);
    setError(null);

    try {
      const variables = {
        project: match.params.project,
        ...task
      };

      const response = await client.mutate({
        mutation: CREATE_TASK_MUTATION,
        variables
      });

      const { data: { createTask = {} } = {} } = response;

      if (createTask.error) {
        throw new Error(createTask.error.message);
      }

      history.push(`/task/${createTask.data.task._id}`);
    } catch (e) {
      setError(e.message);
    }

    setLoading(false);
  });

  return (
    <div>
      <h1>Create Task</h1>
      <TaskForm
        onChange={onChange}
        error={error}
        loading={loading}
        defaults={{ due: new Date(), markdown: `# My Cool Task 🍻` }}
      />
    </div>
  );
}

export default CreateTask;
