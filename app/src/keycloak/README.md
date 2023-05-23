# BCGov SSO Keycloak Frontend Integration

For React:18 on NodeJS:18

<br />

<img src="https://user-images.githubusercontent.com/16313579/224582406-c5f9491b-00be-4889-a4fe-b18987ec1e4c.png">

## Table of Contents

- [General Information](#general-information)
- [Getting Started with the Integration](#getting-started-with-the-integration)

## General Information

- For React:18 on NodeJS:18
- For Keycloak Gold Standard.

## Getting Started with the Integration

1. Place `keycloak/` directory in the `src/` directory.
2. Add import `import { KeycloakProvider } from 'keycloak';` to `main.tsx` file.
3. Wrap `<KeycloakProvider>` component around the AppRouter.
4. Add import `import { KeycloakWrapper } from 'keycloak';` to `AppRouter.tsx` file.
5. Wrap `<KeycloakWrapper>` around Routes inside of Router.
6. Use the following example to implement a login and logout button.

```JavaScript
// Example uses a proxy for API connection.
// Integration will differ without a proxy.

import { useAuthService } from 'keycloak';

const HomePage = () => {
  const { state: authState, getLoginURL, getLogoutURL } = useAuthService();
  const user = authState.userInfo;

  return (
    <>
      {user ? (
        <>
          <p>
            Logged in as User: {user.given_name} {user.family_name}
          </p>
          <button onClick={() => (window.location.href = getLogoutURL())}>Logout</button>
        </>
      ) : (
        <button onClick={() => (window.location.href = getLoginURL())}>Login with IDIR</button>
      )}
    </>
  );
};
```

<br />

Example authState.userInfo object:

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
