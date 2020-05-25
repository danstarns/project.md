# Project.md

> Work in progress 🚧🏗👷‍♂️

📝 A Simple and Robust Markdown Inspired Project Management System


# About

Tired of complicated project management systems? What something that speaks to the Markdown 🐱‍👤 inside of you? Project.md is designed with simplicity at its heart, letting you manage projects & present your ideas with pure Markdown. No longer shall you recursively search nested 'sub tasks' to oblivion 🌌🤯.

You can use this project as; a template, guide for inspiration, your own deployment and a project to contribute towards 🍻

# To Do 🎯
1. Organizations
2. User Profiles
3. Task/Project Comments
4. Notifications/Emails
5. Auth/LockDown routes
6. Invite Users to Projects/Tasks/Organisation
7. Live Demo
8. Recents
9. Audits
10. Favourites 
11. Home Page
12. Logo/Styling

# Tech Stack

> 🍻 To all the unmentioned technologies 

1. Server
    * Node.JS
        1. `express`
        2. `graphql`
            * `idio-graphql`
            * `apollo-server-express`
            * `graphql-voyager`
        3. `mongoose`
        4. `jsonwebtoken`
    * MongoDB
2. Client
    * React.JS
        1. `create-react-app`
        2. `react-bootstrap`
        3. `apollo-client`
        4. `react-markdown`

# Getting Started
Recommended to open `server` & `client` folders in separate instances of your editor. This will allow the `eslint` plugin's work correctly across both `server` & `client`.

> **Environment variables** copy `./.env.example` => `./.env` You may need to adjust variables to suit your setup.

## Server 
1. [MongoDB Server](https://www.mongodb.com/)
2. `cd server`
3. `npm install`
4. `npm run start`

## Client 

1. `cd client`
2. `npm install`
3. `npm run start`

## Docker

> Use this to start client, server & dependencies all at once, take consideration for any local, conflicting, services 🐳

1. `docker-compose up`
