FROM node:12.16.3-buster-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build