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
  Projects,
  Project,
  CreateProject,
  EditProject,
  Auth,
  Task,
  CreateTask,
  EditTask
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
              {/** COMMON */}
              <Route exact path="/" component={Home} />

              {/** AUTH */}
              <Route exact path="/login" component={Auth.Login} />
              <Route exact path="/signup" component={Auth.SignUp} />
              <Route exact path="/logout" component={Auth.Logout} />

              {/** DASHBOARD */}
              <Route exact path="/dashboard" component={Dashboard} />

              {/** ******** PROJECTS */}
              <Route exact path="/projects" component={Projects} />
              <Route exact path="/project/create" component={CreateProject} />
              <Route exact path="/project/:id" component={Project} />
              <Route exact path="/project/edit/:id" component={EditProject} />

              {/** ******** TASKS */}
              <Route
                exact
                path="/task/create/:project"
                component={CreateTask}
              />
              <Route exact path="/task/:id" component={Task} />
              <Route exact path="/task/edit/:id" component={EditTask} />

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
