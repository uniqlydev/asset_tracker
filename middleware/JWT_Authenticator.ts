import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) return res.status(401).json({ message: 'Access denied' });

    jwt.verify(token, process.env.JWT_SECRET || 'defaultSecret', (err, user) => {
      if (err) return res.status(403).json({ message: 'Invalid token' });

      // Store token in session
      req.session.token = token;

      // Set session data based on JWT payload
      req.session.user = {
        email: (user as any).email,
        authenticated: true,
        site_origin: (user as any).site_from,
      };

      console.log('User authenticated:', req.session.user.email);

      next();
    });
  };

export default authenticateToken;
