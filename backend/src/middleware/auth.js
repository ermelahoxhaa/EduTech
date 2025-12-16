import AuthenticationService from '../services/system/AuthenticationService.js';

export const authenticate = (req, res, next) => {
  const token = req.cookies?.token || req.header('x-auth-token');
  if (!token) return res.status(401).json({ error: 'No token, authorization denied' });

  try {
    const decoded = AuthenticationService.verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Token is not valid' });
    }
    req.user = decoded; 
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

export const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !req.user.role) {
    return res.status(401).json({ error: 'User not authenticated' });
  }
  
  const allowedRoles = roles.flat();
  
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ error: 'User not authorized to access this route' });
  }
  next();
};
