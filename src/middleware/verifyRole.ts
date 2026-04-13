// middleware/verifyRole.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../utils/constant';

const verifyRole = (allowedRoles: UserRole[]) => {
 
  return (req: Request &{ user?: jwt.JwtPayload }, res: Response, next: NextFunction): void => {
    
    const user = req.user; // set user details in verifyToken middleware

    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    if (!allowedRoles?.includes(user.role as UserRole)) {
      res.status(403).json(
        { 
            status: 'failed',
            message: 'Access Denied' 
        }
    );
      return;
    }

    next();
  };
};

export default verifyRole;