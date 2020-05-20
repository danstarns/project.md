import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import { AuthContext, GraphQL } from "./contexts/index.js";
import {
  Home,
  NavBar,
  Dashboard,
  Projects,
  Login,
  SignUp,
  Logout
} from "./components/index.js";

function App() {
  return (
    <GraphQL.Provider>
      <AuthContext.Provider>
        <Router>
          <NavBar />
          <Container>
            <Switch>
              {/** COMMON */}
              <Route exact path="/" component={Home} />

              {/** AUTH */}
              <Route exact path="/login" component={Login} />
              <Route exact path="/signup" component={SignUp} />
              <Route exact path="/logout" component={Logout} />

              {/** DASHBOARD */}
              <Route exact path="/dashboard" component={Dashboard} />
              <Route exact path="/projects" component={Projects} />

              {/** 404 */}
              <Route component={Home} />
            </Switch>
          </Container>
        </Router>
      </AuthContext.Provider>
    </GraphQL.Provider>
  );
}

export default App;
