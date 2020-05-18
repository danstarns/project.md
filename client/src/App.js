/* eslint-disable no-undef */
import React from "react"
import { AuthContext, GraphQL } from "./contexts/index.js"

function App() {
  return (
    <GraphQL.Provider>
      <AuthContext.Provider>
        <h1>Hello World Server URL is {process.env.REACT_APP_API_URL}</h1>
      </AuthContext.Provider>
    </GraphQL.Provider>
  )
}

export default App
