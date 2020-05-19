import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

const Query = gql`
  {
    me {
      username
    }
  }
`;

function Dashboard() {
  const { loading, error, data } = useQuery(Query);

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  return <h1>Hi From Dashboard, Welcome {data.me.username}</h1>;
}

export default Dashboard;
