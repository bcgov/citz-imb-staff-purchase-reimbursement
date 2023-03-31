FROM node:18.15.0-alpine

# Add curl for health check
RUN apk --update --no-cache add curl

# Directory used in container
WORKDIR /usr/app/

# Copy dependency package, install, copy everything else
COPY package*.json .
RUN npm i --omit=dev
COPY . .

# Install vite. Was not present otherwise for some reason.
RUN ["npm", "i", "vite"]

# Expose the default port
EXPOSE 8080 

CMD ["npm", "run", "dev"]
