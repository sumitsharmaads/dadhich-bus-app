import { userRepository } from '../repositories/user.repository';
import { AppError } from '../utils/errors';
import { signAccessToken, signRefreshToken } from '../utils/jwt';
import { LoginInput, TempRegisterInput } from '../schemas/auth.schema';

export const authService = {
  async register(input: TempRegisterInput) {
    const existing = await userRepository.findByEmail(input.email);
    if (existing) {
      throw new AppError('Email already in use', 409, 'EMAIL_IN_USE');
    }
    const username = input.email.split('@')[0];
    const user = await userRepository.create({
      email: input.email,
      fullname: input.fullname,
      username,
      password: input.password,
      phone: input.phone ? Number(input.phone) : undefined,
    } as any);

    const payload = { sub: user.id };

    return {
      user: { id: user.id, email: user.email, fullname: user.fullname },
      tokens: {
        accessToken: signAccessToken(payload),
        refreshToken: signRefreshToken(payload),
      },
    };
  },

  async login(input: LoginInput) {
    const user = await userRepository.findByEmail(input.email, true);
    if (!user) {
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    const valid = await user.comparePassword(input.password);
    if (!valid) {
      throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    const payload = { sub: user.id };

    return {
      user: { id: user.id, email: user.email, fullname: user.fullname },
      tokens: {
        accessToken: signAccessToken(payload),
        refreshToken: signRefreshToken(payload),
      },
    };
  },
};
