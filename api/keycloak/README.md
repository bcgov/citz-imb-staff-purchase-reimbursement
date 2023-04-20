# BCGov SSO Keycloak Integration

For NodeJS:18 Express API

<br />

<img src="https://user-images.githubusercontent.com/16313579/223932048-a254cbfd-aa7e-43ef-ae66-c4f9c360bf06.png">

## Table of Contents

- [General Information](#general-information)
- [Directory Structure](#directory-structure)
- [Getting Started with the Integration](#getting-started-with-the-integration)
- [Environment Variables](#environment-variables)
- [Authentication Flow](#authentication-flow)
- [Authentication on an Endpoint](#authentication-on-an-endpoint)
- [Authorization on an Endpoint](#authorization-on-an-endpoint)

## General Information

- For running on a NodeJS:18 Express API.
- For Keycloak Gold Standard.

## Directory Structure

```JavaScript
keycloak/
|─ configuration.js
|  └─ // Imports environment variables and exports configuration variables.
|  └─ // See (Environment Variables) section for required variables.
|
|─ controllers.js
|  └─ // Functions that process the request of an endpoint.
|
|─ index.js
|  └─ // Exports middleware and keycloakInit functions.
|  └─ // keycloakInit is responsible for initializing the Keycloak integration with the API.
|
|─ middleware.js
|  └─ // Creates the middleware that is exported by the index.js file.
|  └─ // Middleware protects an endpoint so that it requires the user be logged in to use.
|  └─ // Middleware provides user object on the request which is the decoded user info from Keycloak.
|
|─ routes.js
|  └─ // Routes used to authenticate with the Keycloak integration.
|
|─ utils.js
|  └─ // Functions used by the Keycloak integration.
```

<br/>

## Getting Started with the Integration

1. Place `keycloak/` directory in the src directory.
2. Add import `const { keycloakInit } = require("./src/keycloak");` to the top of the file that defines the express app.
3. Add `keycloakInit(app);` below the definition of the express app.
4. Add the required packages with `npm i express axios body-parser dotenv cookie-parser` and `npm i -D @types/express @types/cookie-parser`.
5. Add the required environment variables from the (Environment Variables) section below.

<br />

## Environment Variables

```ENV
# Ensure the following environment variables are defined on the container.

ENVIRONMENT= # (local only) Set to 'local' when running container locally.
FRONTEND_PORT= # (local only) Port of the frontend application.
API_PORT= # (local only) Port of the backend application.

FRONTEND_URL= # (production only) URL of the frontend application.
BACKEND_URL= # (production only) URL of the backend application.

SSO_CLIENT_ID= # Keycloak client_id
SSO_CLIENT_SECRET= # Keycloak client_secret
SSO_AUTH_SERVER_URL= # Keycloak auth URL, see example below.
# https://dev.loginproxy.gov.bc.ca/auth/realms/standard/protocol/openid-connect
```

<br />

## Authentication Flow

The Keycloak Authentication system begins when the user visits the `/oauth/login` endpoint.

1. The user is redirected to the Keycloak Login Page for our application.
2. Upon successful login, they are redirected back to our app's `/oauth/login/callback` endpoint with an "authentication code".
3. Using this authentication code, our api reaches out to Keycloak on our user's behalf and retrieves them an [access token], and a [refresh token].
4. The user is redirected back to the frontend with an access token within the query parameters, and a refresh token as an httpOnly cookie.

<br/>

## Authentication on an Endpoint

Require keycloak authentication before using an endpoint.
Import `middleware` from `keycloak` and add as middleware.

Example (middleware is aliased to 'protect'):

```JavaScript
const { middleware: protect } = require("./keycloak");

app.use("/users", protect, usersRouter);
```

<br/>

## Authorization on an Endpoint

Get the keycloak user info in a protected endpoint.  
`req.user` is either populated or null and the `client_roles` property is either a populated array or undefined.

Example:

```JavaScript
const user = req.user;
if (!user) res.status(404).send("User not found.");
else // Do something with user.
```

Example req.user object:

```JSON
{
  "idir_user_guid": "W7802F34D2390EFA9E7JK15923770279",
  "identity_provider": "idir",
  "idir_username": "JOHNDOE",
  "name": "Doe, John CITZ:EX",
  "preferred_username": "a7254c34i2755fea9e7ed15918356158@idir",
  "given_name": "John",
  "display_name": "Doe, John CITZ:EX",
  "family_name": "Doe",
  "email": "john.doe@gov.bc.ca",
  "client_roles": ["admin"]
}
```

<!-- Link References -->

[access token]: https://auth0.com/docs/secure/tokens/access-tokens
[refresh token]: https://developer.okta.com/docs/guides/refresh-tokens/main/
