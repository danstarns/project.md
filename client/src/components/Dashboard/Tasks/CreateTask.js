import React, { useState, useContext } from "react";
import gql from "graphql-tag";
import { GraphQL } from "../../../contexts/index.js";
import TaskForm from "./TaskForm.js";

const Mutation = gql`
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

  async function onChange(task) {
    setLoading(true);
    setError(null);

    try {
      const variables = {
        project: match.params.project,
        ...task
      };

      const response = await client.mutate({
        mutation: Mutation,
        variables
      });

      const { data: { createTask = {} } = {} } = response;

      if (createTask.error) {
        throw new Error(createTask.error.message);
      }

      // eslint-disable-next-line no-underscore-dangle
      history.push(`/task/${createTask.data.task._id}`);
    } catch (e) {
      setError(e.message);
    }

    setLoading(false);
  }
  return (
    <TaskForm
      onChange={onChange}
      error={error}
      loading={loading}
      defaults={{ due: new Date(), markdown: `# My Cool Task 🍻` }}
    />
  );
}

export default CreateTask;
