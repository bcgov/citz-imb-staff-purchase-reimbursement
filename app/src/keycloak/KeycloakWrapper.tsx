import React, { ReactNode, useEffect } from 'react';

import useAuthService from './service/useAuthService';

interface IKeycloakWrapper {
  children: ReactNode;
}

const KeycloakWrapper = (props: IKeycloakWrapper) => {
  const { children } = props;
  const { setUserInfo, refreshAccessToken } = useAuthService();
  const tokenRefreshTime = 1000 * 60; // 60 seconds

  const checkToken = () => {
    // Get the current URL and its search parameters
    const url = new URL(window.location.href);
    const { searchParams } = url;
    const token = searchParams.get('token');

    if (token) {
      setUserInfo(token);
      searchParams.delete('token');
      // Create a new URL with the updated search parameters
      const newUrl = `${url.origin}${url.pathname}${searchParams.toString()}`;
      window.history.pushState({}, '', newUrl);
    } else {
      // If there is no token in the URL, try to refresh the access token
      refreshAccessToken();
    }
  };

  useEffect(() => {
    checkToken();
    setInterval(checkToken, tokenRefreshTime);
  }, []);

  return <div>{children}</div>;
};

export default KeycloakWrapper;
