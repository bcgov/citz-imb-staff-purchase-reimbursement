import { Request, Response } from 'express';
import Constants from '../constants/Constants';

/**
 * @description Used to redirect to Swagger page from other routes.
 * @param req Incoming Request
 * @param res Outgoing Response
 * @returns Redirect response with actual Swagger route.
 */
export const swaggerRedirect = async (req: Request, res: Response) => {
  const { BACKEND_URL } = Constants;
  return res.redirect(`${BACKEND_URL}/api/docs`);
}
