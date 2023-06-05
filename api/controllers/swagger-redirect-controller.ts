import { Request, Response } from 'express';
import Constants from '../constants/Constants';

// Used to redirect to Swagger page from other pages  
export const swaggerRedirect = async (req: Request, res: Response) => {
  const { BACKEND_URL } = Constants;
  return res.redirect(`${BACKEND_URL}/api/docs`);
}
