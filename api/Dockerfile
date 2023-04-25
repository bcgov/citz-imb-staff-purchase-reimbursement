##################
### BASE IMAGE ###
##################
FROM node:18.15.0-alpine AS base

# Directory used in container
WORKDIR /usr/api/

# Copy dependency package, install, copy everything else
COPY package*.json .
RUN npm i --omit=dev
COPY . .

# Install TypeScript. Needed for build process.
RUN npm i -D typescript

# Compile to JavaScript build 
RUN npm run build


##################
### PROD IMAGE ###
##################
FROM node:18.15.0-alpine as prod

# Add curl for health check
RUN apk --update --no-cache add curl

# Directory used in container
WORKDIR /usr/api/

# Install packages. Needed even for compiled build.
COPY package*.json .
RUN npm i --omit=dev

# Copy compiled build from base
COPY --from=base /usr/api/dist /usr/api/

CMD [ "node", "server.js" ]
