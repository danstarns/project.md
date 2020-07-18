import React, { useContext } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AuthContext } from "../contexts/index.js";
import { Markdown } from "./Markdown/index.js";

const markdown = `
# Project.md
> Work in progress 👷‍♂️

📝 Exemplary markdown inspired project management built with; React, Node, GraphQL, MongoDB, Redis & Minio/S3.

# About
Tired of complicated project management systems? What something that speaks to the Markdown 🐱‍👤 inside of you? Project.md is designed with simplicity at its heart, letting you manage projects & present your ideas with pure Markdown. No longer shall you recursively search nested 'sub tasks' to oblivion.

# Tech Stack
> 🍻 To all the unmentioned technologies 

1. Server
    * Node.JS
        1. \`express\`
        2. \`graphql\`
            * \`idio-graphql\`
            * \`apollo-server-express\`
            * \`graphql-voyager\`
            * \`graphql-subscriptions\`
            * \`graphql-upload\`
        3. \`mongoose\`
        4. \`jsonwebtoken\`
        5. \`ioredis\`
        6. \`bull\`
        7. \`nodemailer\`
        8. \`minio\`
    * Minio/S3
    * MongoDB
    * Redis
2. Client
    * React.JS
        1. \`create-react-app\`
        2. \`react-bootstrap\`
        3. \`apollo-client\`
        4. \`react-markdown\`

# Getting Started
Recommended to open \`server\` & \`client\` folders in separate instances of your editor. This will allow the \`eslint\` plugin\'s work correctly across both \`server\` & \`client\`.

> **Environment variables** copy \`./.env.example\` => \`./.env\` You may need to adjust variables to suit your setup.

## Server 
1. [MongoDB Server](https://www.mongodb.com/)
2. [Redis](https://redis.io/)
3. [Minio](https://min.io/)
4. \`cd server\`
5. \`npm install\`
6. \`npm run start\`

### Emails
This project uses [Nodemailer](https://nodemailer.com/about/) to send emails, you will need to adjust the config in either \`./server/.env\` or if you are using [Docker](#docker) adjust the variables in \`./docker-compose.yml\`.

\`\`\`
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587
EMAIL_USER=testuser
EMAIL_PASSWORD=password
EMAIL_SECURE=true
EMAIL_FROM=no-reply@project-md.com
\`\`\`

## Client 
1. \`cd client\`
2. \`npm install\`
3. \`npm run start\`

## Docker
> Use this to start client, server & dependencies all at once, take consideration for any local, conflicting, services 🐳

1. \`docker-compose up\`

### Docker Containers
> Use the following commands to setup the dependencies manually

#### MongoDB
\`\`\`
$ docker run -d --publish 27017:27017 --name project-md-mongo mongo 
\`\`\`

#### Redis
\`\`\`
$ docker run -d --publish 6379:6379 --name project-md-redis redis
\`\`\`

#### Minio/S3
\`\`\`
$ docker run -d --publish 9000:9000 --name project-md-minio -e MINIO_ACCESS_KEY=accesskey -e MINIO_SECRET_KEY=secretkey minio/minio server /data
\`\`\`
`;
function Home({ history }) {
  const { isLoggedIn } = useContext(AuthContext.Context);

  return (
    <div>
      <Row>
        <Col className="p-2">
          <Card className="home-link-card">
            <Button
              className="h-100 w-100 m-0"
              variant="outline-primary"
              onClick={() => history.push("/projects")}
            >
              <span className="home-link-card-text">
                <FontAwesomeIcon size="2x" icon="clipboard" className="mr-3" />
                Projects
              </span>
            </Button>
          </Card>
        </Col>
        <Col className="p-2">
          <Card className="home-link-card">
            <Button
              className="h-100 w-100 m-0"
              variant="outline-primary"
              onClick={() => history.push("/organizations")}
            >
              <span className="home-link-card-text">
                <FontAwesomeIcon size="2x" icon="building" className="mr-3" />
                Organizations
              </span>
            </Button>
          </Card>
        </Col>
      </Row>

      {!isLoggedIn && (
        <Row>
          <Col className="p-2">
            <Card className="home-link-card">
              <Button
                className="h-100 w-100 m-0"
                variant="outline-primary"
                onClick={() => history.push("/login")}
              >
                <span className="home-link-card-text">
                  <FontAwesomeIcon size="2x" icon="key" className="mr-3" />
                  Login
                </span>
              </Button>
            </Card>
          </Col>
          <Col className="p-2">
            <Card className="home-link-card">
              <Button
                className="h-100 w-100 m-0"
                variant="outline-primary"
                onClick={() => history.push("/signup")}
              >
                <span className="home-link-card-text">
                  <FontAwesomeIcon size="2x" icon="user" className="mr-3" />
                  SignUp
                </span>
              </Button>
            </Card>
          </Col>
        </Row>
      )}

      <Row className="p-2">
        <Card className="m-0 p-3">
          <Markdown
            markdown={markdown}
            style={{ fontSize: "larger !important" }}
          />
        </Card>
      </Row>
    </div>
  );
}

export default Home;
