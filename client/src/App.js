import React from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import { Container } from "react-bootstrap"
import { AuthContext, GraphQL } from "./contexts/index.js"
import { Home, NavBar, Dashboard, Login, SignUp } from "./components/index.js"

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

              {/** AUTHORIZED */}
              <Route exact path="/dashboard" component={Dashboard} />
            </Switch>
          </Container>
        </Router>
      </AuthContext.Provider>
    </GraphQL.Provider>
  )
}

export default App
