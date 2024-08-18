import { Request, Response, NextFunction } from 'express';

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.session?.user?.authenticated) {
        return next(); // User is authenticated, proceed to the next middleware or route handler
    } else {
        return res.status(401).json({ message: "Unauthorized" }); // User is not authenticated
    }
};

export { isAuthenticated };
