import React, { useContext } from "react";
import { AuthContext } from "../../contexts/index.js";

function Dashboard() {
  const { user } = useContext(AuthContext.Context);

  return <h1>Hi From Dashboard, Welcome {user.username}</h1>;
}

export default Dashboard;
