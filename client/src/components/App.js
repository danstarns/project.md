/* eslint-disable */
import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import { NavBar } from "./Common/index.js";
import Auth from "./Auth/index.js";
import Task from "./Task/index.js";
import Project from "./Project/index.js";
import Organization from "./Organization/index.js";
import * as Routes from "./Routes/index.js";
import Notification from "./Notification";
import User from "./User/index.js";
import Toasts from "./Toast/index.js";
import Document from "./Document/index.js";
import Common from "./Common/index.js";
import { AuthContext, GraphQL, ToastContext, NotificationContext } from "../contexts/index.js";

function App() {
  return (
    <GraphQL.Provider>
      <ToastContext.Provider>
        <AuthContext.Provider>
          <NotificationContext.Provider>
          <Router>
            <NavBar />
            <Toasts />
            <Container>
              <Switch>
                <Route exact path="/" component={Common.Home} />
                <Route exact path="/dashboard" component={Common.Dashboard} />

                <Route exact path="/login" component={Auth.Login} />
                <Route exact path="/signup" component={Auth.SignUp} />
                <Route exact path="/logout" component={Auth.Logout} />
                <Route exact path="/forgot-password" component={Auth.ForgotPassword} />
                <Route exact path="/password-reset/:token" component={Auth.PasswordReset} />
                <Routes.Protected exact path="/notifications" component={Notification.Notifications} />
                <Routes.Protected exact path="/invite/:id" component={Notification.Invite} />
                <Route path="/profile/:id" component={User.Profile} />

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

                <Routes.Protected path="/document/create/:type/:id" component={Document.CreateDocument} />
                <Routes.Protected path="/document/edit/:id" component={Document.EditDocument} />

                <Route component={Common.NotFound} />
              </Switch>
            </Container>
          </Router>
          </NotificationContext.Provider>
        </AuthContext.Provider>
      </ToastContext.Provider>
    </GraphQL.Provider>
  );
}

export default App;
