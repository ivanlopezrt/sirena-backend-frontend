FROM node:18.20.4

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm ci --silent --force; exit 0

COPY . /usr/src/app

RUN npm run build

ENTRYPOINT npm run start

EXPOSE 3000
