# Project.md

📝 A Simple and Robust Markdown Inspired Project Management System

# About
Tired of complicated project management systems? What something that speaks to the Markdown 🐱‍👤 inside of you? Project.md is designed with simplicity at its heart, letting you manage projects & present your ideas with pure Markdown. No longer shall you recursively search nested 'sub tasks' to oblivion 🌌🤯.

# Tech Stack

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
2. `npm install`
3. `npm run start`

## Client 

1. `npm install`
2. `npm run start`
