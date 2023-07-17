// Describes the user info contained in the request
export interface User {
  idir_user_guid: string;
  identity_provider: string;
  idir_username: string;
  name: string;
  preferred_username: string;
  given_name: string;
  display_name: string;
  family_name: string;
  email: string;
  client_roles?: string[];
}
