import userUseCases from '../../application/usecases/userUseCases.js';
import { success, fail, error } from '../../utils/jsend.js';

class UserController {
  async register(req, res) {
    try {
      const { email, password, firstName, lastName } = req.body;

      if (!email || !password) {
        return res.status(400).json(fail({ email: 'Email and password are required' }));
      }

      const result = await userUseCases.register(email, password, firstName, lastName);

      return res.status(201).json(success({
        user: result.user,
        token: result.token,
      }, 'User registered successfully'));
    } catch (err) {
      if (err.message === 'User with this email already exists') {
        return res.status(409).json(fail({ email: err.message }));
      }
      return res.status(500).json(error(err.message));
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json(fail({ email: 'Email and password are required' }));
      }

      const result = await userUseCases.login(email, password);

      return res.status(200).json(success({
        user: result.user,
        token: result.token,
      }, 'Login successful'));
    } catch (err) {
      if (err.message === 'Invalid credentials') {
        return res.status(401).json(fail({ credentials: err.message }));
      }
      return res.status(500).json(error(err.message));
    }
  }
}

export default new UserController();




