import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../utils/constant';

const verifyToken = (req: Request & { user?: jwt.JwtPayload }, res: Response, next: NextFunction): void => {
    // const token = req.cookies.token;
  const tokenVal = req.headers['authorization'];
  const token = tokenVal?.split(' ')[1]; // Extract token from "Bearer <token>" format

  if (!token) {
    res.status(401).json({ 
      status: 'failed',
      message: 'Token not provided, kindly login again'
     });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string; userName: string; role: UserRole };
    req.user = decoded
    next();
  } catch {
    res.status(401).json({ 
      status: 'failed',
      message: 'Invalid token or token expired' 
    });
  }
};

export default verifyToken;