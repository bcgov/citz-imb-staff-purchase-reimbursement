import config from './configuration';
import { Request, Response } from 'express';
import { getAccessToken, getAuthorizationUrl, getLogoutUrl } from './utils';

/**
 * Prompts the user to login.
 * @author Zach Bourque
 * @method GET
 * @route /oauth/login
 */
export const login = async (req: Request, res: Response) => {
  try {
    if (req.token) {
      res.redirect(``);
    } else {
      const authUrl = await getAuthorizationUrl();
      res.redirect(authUrl);
    }
  } catch (error: any) {
    // tslint:disable-next-line:no-console
    console.error('Keycloak: Error in login controller', error);
    res.json({ success: false, error: error.message || error });
  }
};

/**
 * Redirects user to the frontend, with an access and refresh token.
 * @author Zach Bourque
 * @method GET
 * @route /oauth/login/callback
 */
export const callback = async (req: Request, res: Response) => {
  try {
    const { code } = req.query;
    const tokens = await getAccessToken(code);
    const redirectUrl = new URL(config.FRONTEND_URL ?? '');
    redirectUrl.searchParams.set('token', tokens.access_token);
    res
      .cookie('refresh_token', tokens.refresh_token, { httpOnly: true })
      .redirect(redirectUrl.toString());
  } catch (error: any) {
    // tslint:disable-next-line:no-console
    console.error('Keycloak: Error in login callback controller', error);
    res.json({ success: false, error: error.message || error });
  }
};

/**
 * Logs out the user and, once finished, redirects them to /oauth/logout/callback
 * @author Zach Bourque
 * @method GET
 * @route /oauth/logout
 */
export const logout = (req: Request, res: Response) => {
  try {
    const logoutUrl = getLogoutUrl();
    res.redirect(logoutUrl);
  } catch (error: any) {
    // tslint:disable-next-line:no-console
    console.error('Keycloak: Error in logout controller', error);
    res.json({ success: false, error: error.message || error });
  }
};

/**
 * Removes the user's httpOnly refresh token, and redirects back to the frontend.
 * @author Zach Bourque
 * @method GET
 * @route /oauth/logout/callback
 */
export const logoutCallback = (req: Request, res: Response) => {
  try {
    res.cookie('refresh_token', '', { httpOnly: true }).redirect(config.FRONTEND_URL ?? '');
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.error('Keycloak: Error in logout callback controller', error);
  }
};
