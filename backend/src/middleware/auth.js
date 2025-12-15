import AuthenticationService from '../services/system/AuthenticationService.js';

export const authenticate = (req, res, next) => {
  // Check for token in cookies first, then in headers
  const token = req.cookies?.token || req.header('x-auth-token');
  if (!token) return res.status(401).json({ error: 'No token, authorization denied' });

  try {
    const decoded = AuthenticationService.verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Token is not valid' });
    }
    req.user = decoded; // The decoded token contains id, email, role directly
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: 'User not authorized to access this route' });
  }
  next();
};
