import { Request, Response } from 'express';

/**
 * @description Used to check if API is running.
 * @param req Incoming request
 * @param res Outgoing response
 * @returns A 200 status indicating API is healthy and running
 */
export const healthCheck = async (req: Request, res: Response) => {
    return res.status(200).send('/health endpoint reached. API running.');
}
