import { Request, Response, NextFunction } from 'express';

import { NotAuthorizedError } from '../errors/not-authorized-error';

export const requireAuth = (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    // check if user not authorized
    if (!req.currentUser) {
        throw new NotAuthorizedError();
    }

    next();
};