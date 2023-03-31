FROM node:18.15.0-alpine

# Add curl for health check
RUN apk --update --no-cache add curl

# Directory used in container
WORKDIR /usr/api/

# Copy dependency package, install, copy everything else
COPY package*.json .
RUN npm i --omit=dev
COPY . .



# Expose the port
#EXPOSE 3004

CMD ["node", "server.js"]
