/* eslint-disable */
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faSortUp,
  faSortDown,
  faChevronLeft,
  faChevronRight,
  faUserLock,
  faGlasses,
  faTrash,
  faRobot,
  faExclamation,
  faCheck,
  faBuilding,
  faUser,
  faAt,
  faUserTag
} from "@fortawesome/free-solid-svg-icons";
import {
  Home,
  NavBar,
  Dashboard,
  Auth,
  Task,
  Project,
  Organization,
  Routes,
  Notification,
  NotFound,
  User,
  Toasts
} from "./components/index.js";
import { AuthContext, GraphQL, ToastContext } from "./contexts/index.js";

library.add(
  faSortUp,
  faSortDown,
  faChevronLeft,
  faChevronRight,
  faUserLock,
  faGlasses,
  faTrash,
  faRobot,
  faExclamation,
  faCheck,
  faBuilding,
  faUser,
  faAt,
  faUserTag
);

function App() {
  return (
    <GraphQL.Provider>
      <ToastContext.Provider>
      <AuthContext.Provider>
        <Router>
          <NavBar />
          <Toasts />
          <Container>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/dashboard" component={Dashboard} />

              <Route exact path="/login" component={Auth.Login} />
              <Route exact path="/signup" component={Auth.SignUp} />
              <Route exact path="/logout" component={Auth.Logout} />
              <Route exact path="/forgot-password" component={Auth.ForgotPassword} />
              <Route exact path="/password-reset/:token" component={Auth.PasswordReset} />
              <Routes.Protected exact path="/notifications" component={Notification.Notifications} />
              <Routes.Protected exact path="/invite/:id" component={Notification.Invite} />
              <Routes.Protected exact path="/profile/:id" component={User.Profile} />

              <Routes.Protected path="/project/create/:organization?" component={Project.CreateProject} />
              <Route exact path="/projects" component={Project.Projects} />
              <Route exact path="/project/:id" component={Project.Project} />
              <Routes.Protected exact path="/project/edit/:id" component={Project.EditProject} />

              <Routes.Protected exact path="/task/create/:project" component={Task.CreateTask} />
              <Route exact path="/task/:id" component={Task.Task} />
              <Routes.Protected exact path="/task/edit/:id" component={Task.EditTask} />

              <Routes.Protected exact path="/organization/create" component={Organization.CreateOrganization} />
              <Route exact path="/organizations" component={Organization.Organizations} />
              <Route exact path="/organization/:id" component={Organization.Organization} />
              <Routes.Protected exact path="/organization/edit/:id" component={Organization.EditOrganization} />

              <Route component={NotFound} />
            </Switch>
          </Container>
        </Router>
      </AuthContext.Provider>
      </ToastContext.Provider>
    </GraphQL.Provider>
  );
}

export default App;
