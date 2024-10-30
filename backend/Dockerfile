FROM node:18.20.4

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json .

# For npm@5 or later, copy package-lock.json as well
COPY package-lock.json .

RUN npm install

# Bundle app source
COPY . .

EXPOSE 3003

CMD ["node", "server.js"]
