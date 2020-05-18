import React, { useState } from "react"

const Context = React.createContext()

function Provider(props) {
  const { value, setValue } = useState({})

  return <Context.Provider value={value}>{props.children}</Context.Provider>
}

export { Context, Provider }
