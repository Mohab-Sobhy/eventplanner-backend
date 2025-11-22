import bcrypt from 'bcryptjs';
import userRepository from '../../infrastructure/repositories/userRepository.js';
import { generateToken } from '../../utils/jwt.js';

class UserUseCases {
  async register(email, password, firstName, lastName) {
    // Check if user exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await userRepository.create(email, passwordHash, firstName, lastName);

    // Generate token
    const token = generateToken({ userId: user.id, email: user.email });

    return { user, token };
  }

  async login(email, password) {
    // Find user
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    // Generate token
    const token = generateToken({ userId: user.id, email: user.email });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
      },
      token,
    };
  }
}

export default new UserUseCases();




