import jwt from 'jsonwebtoken';

class TokenManager {
  constructor() {
    if (TokenManager.instance) {
      return TokenManager.instance;
    }
    TokenManager.instance = this;
    
    this.secret = process.env.JWT_SECRET;
    if (!this.secret) {
      console.warn('JWT_SECRET not set in environment variables');
    }
  }

  generate(payload, expiresIn = '1d') {
    if (!this.secret) {
      throw new Error('JWT_SECRET is not configured');
    }
    return jwt.sign(payload, this.secret, { expiresIn });
  }

  verify(token) {
    if (!this.secret) {
      return null;
    }
    try {
      return jwt.verify(token, this.secret);
    } catch (err) {
      return null;
    }
  }

  decode(token) {
    try {
      return jwt.decode(token);
    } catch (err) {
      return null;
    }
  }
}

export default new TokenManager();

