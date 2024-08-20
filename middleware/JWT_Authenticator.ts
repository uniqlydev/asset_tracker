import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import 'dotenv/config';

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    // Extract token from 'Authorization' header
    const authHeader = req.header('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    if (!token) {
        return res.status(401).json({ message: 'Access denied' });
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET || 'defaultSecret', (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        // Attach user information to request object
        (req as any).user = user;
        next();
    });
};

export default authenticateToken;
