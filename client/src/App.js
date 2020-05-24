import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faSortUp,
  faSortDown,
  faChevronLeft,
  faChevronRight
} from "@fortawesome/free-solid-svg-icons";
import {
  Home,
  NavBar,
  Dashboard,
  Auth,
  Task,
  Project
} from "./components/index.js";
import { AuthContext, GraphQL } from "./contexts/index.js";

library.add(faSortUp, faSortDown, faChevronLeft, faChevronRight);

function App() {
  return (
    <GraphQL.Provider>
      <AuthContext.Provider>
        <Router>
          <NavBar />
          <Container>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/dashboard" component={Dashboard} />

              <Route exact path="/login" component={Auth.Login} />
              <Route exact path="/signup" component={Auth.SignUp} />
              <Route exact path="/logout" component={Auth.Logout} />

              <Route exact path="/projects" component={Project.Projects} />
              <Route
                exact
                path="/project/create"
                component={Project.CreateProject}
              />
              <Route exact path="/project/:id" component={Project.Project} />
              <Route
                exact
                path="/project/edit/:id"
                component={Project.EditProject}
              />

              <Route
                exact
                path="/task/create/:project"
                component={Task.CreateTask}
              />
              <Route exact path="/task/:id" component={Task.Task} />
              <Route exact path="/task/edit/:id" component={Task.EditTask} />

              <Route component={Home} />
            </Switch>
          </Container>
        </Router>
      </AuthContext.Provider>
    </GraphQL.Provider>
  );
}

export default App;
