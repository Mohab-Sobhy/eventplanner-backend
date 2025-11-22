import { verifyToken } from '../../utils/jwt.js';
import { error } from '../../utils/jsend.js';

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json(error('Authentication required'));
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json(error('Invalid or expired token'));
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json(error('Authentication failed'));
  }
};




