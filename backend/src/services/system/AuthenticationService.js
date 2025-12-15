import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import DataAccessLayer from '../../dataAccess/DataAccessLayer.js';

class AuthenticationService {
  async login(email, password) {
    const user = await DataAccessLayer.getUserByEmail(email);

    if (!user) {
      throw new Error('Incorrect email or password.');
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      throw new Error('Incorrect password');
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role 
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d'
      }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      }
    };
  }

  async signup(userData) {
    const { email, password, name } = userData;

    if (!email || !password || !name) {
      throw new Error('All fields are required.');
    }

    const existingUser = await DataAccessLayer.getUserByEmail(email);
    if (existingUser) {
      throw new Error('Email already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await DataAccessLayer.createUser({
      name,
      email,
      password: hashedPassword,
      role: 0
    });

    return { message: 'User was successfully registered.' };
  }

  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    } catch (err) {
      return null;
    }
  }
}

export default new AuthenticationService();

