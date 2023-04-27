import { Request, Response } from 'express';

// Used to check if API is running.
export const healthCheck = async (req: Request, res: Response) => {
    return res.status(200).send('/health endpoint reached. API running.');
}
