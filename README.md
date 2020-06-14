# Project.md
> Work in progress 🚧🏗👷‍♂️

📝 Exemplary markdown inspired project management built with; React, Node, GraphQL & MongoDB.

# About
Tired of complicated project management systems? What something that speaks to the Markdown 🐱‍👤 inside of you? Project.md is designed with simplicity at its heart, letting you manage projects & present your ideas with pure Markdown. No longer shall you recursively search nested 'sub tasks' to oblivion 🌌🤯.

# To Do
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
        5. `ioredis`
        6. `bull`
        7. `nodemailer`
    * MongoDB
    * Redis
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
2. [Redis](https://redis.io/)
3. `cd server`
4. `npm install`
5. `npm run start`

### Emails
This project uses [Nodemailer](https://nodemailer.com/about/) to send emails, you will need to adjust the config in either `./server/.env` or if you are using [Docker](#docker) adjust the variables in `./docker-compose.yml`

```
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USER=testuser
EMAIL_PASSWORD=password
EMAIL_SECURE=true
EMAIL_FROM=no-reply@project-md.com
```

## Client 
1. `cd client`
2. `npm install`
3. `npm run start`

## Docker
> Use this to start client, server & dependencies all at once, take consideration for any local, conflicting, services 🐳

1. `docker-compose up`

### Docker Containers
> Use the following commands to setup the dependencies manually

#### MongoDB
```
$ docker run -d --publish 27017:27017 --name project-md-mongo mongo 
```

#### Redis
```
$ docker run -d --publish 6379:6379 --name project-md-redis redis
```