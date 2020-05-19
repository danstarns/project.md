import React from "react"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import { Container } from "react-bootstrap"
import { AuthContext, GraphQL } from "./contexts/index.js"
import { Home, NavBar } from "./components/index.js"

function App() {
  return (
    <GraphQL.Provider>
      <AuthContext.Provider>
        <NavBar />
        <Container>
          <Router>
            <Switch>
              <Route exact path="/" component={Home} />
            </Switch>
          </Router>
        </Container>
      </AuthContext.Provider>
    </GraphQL.Provider>
  )
}

export default App
