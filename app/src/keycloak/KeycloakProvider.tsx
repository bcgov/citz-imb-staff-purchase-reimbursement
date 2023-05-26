import React, { createContext, Dispatch, ReactNode, useReducer } from 'react';

import { AuthAction, AuthState, initialState, reducer } from './service/authReducer';

// Create an initial context with initialState.
export const AuthContext = createContext<AuthState>(initialState);

// Interface that extends the AuthState interface and adds a dispatch function.
export interface AuthStateWithDispatch extends AuthState {
  dispatch: Dispatch<AuthAction>;
}

interface IKeycloakProvider {
  children: ReactNode;
}

/**
 * Provides a keycloak authentication context to its children.
 * @param {ReactNode} children - The children components to be wrapped with the authentication context.
 */
const KeycloakProvider = (props: IKeycloakProvider) => {
  const { children } = props;
  // Initialize the authentication state and dispatch function using the reducer.
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AuthContext.Provider value={{ state, dispatch } as unknown as AuthStateWithDispatch}>
      {children}
    </AuthContext.Provider>
  );
};

export default KeycloakProvider;
