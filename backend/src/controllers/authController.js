import AuthenticationService from '../services/system/AuthenticationService.js';

class AuthController {
  static async login(req, res) {
    const { email, password } = req.body;

    try {
      const result = await AuthenticationService.login(email, password);

      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax', 
        maxAge: 24 * 60 * 60 * 1000 
      });

      return res.json({
        message: 'Login successful',
        token: result.token,
        user: result.user
      });

    } catch (err) {
      console.error('Error during login:', err.message);
      const statusCode = err.message.includes('Incorrect') ? 401 : 500;
      res.status(statusCode).json({ message: err.message || 'Error while processing the request.' });
    }
  }

  static async signup(req, res) {
    const { email, password, name } = req.body;

    try {
      const result = await AuthenticationService.signup({ email, password, name });
      res.status(201).json(result);
    } catch (err) {
      console.error('Error during registration:', err.message);
      const statusCode = err.message.includes('already exists') ? 409 : 
                        err.message.includes('required') ? 400 : 500;
      res.status(statusCode).json({ message: err.message || 'Error while processing registration.' });
    }
  }

  static async logout(req, res) {
    try {
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });
      
      return res.json({ message: 'Logout successful' });
    } catch (err) {
      console.error('Error during logout:', err.message);
      res.status(500).json({ message: 'Error while processing logout.' });
    }
  }
}

export default AuthController;

