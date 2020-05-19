import React from "react"

const defaultLinks = ["home"]

const guestLinks = [...defaultLinks, "signup", "login"]

const userLinks = [...defaultLinks, "My Account", "Dashboard", "Logout"]

function NavBar() {
  return <h1>Hi From NavBar</h1>
}

export default NavBar
