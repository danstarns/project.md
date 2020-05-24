FROM node:12.16.3

WORKDIR /app

RUN npm install -g cross-env

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]