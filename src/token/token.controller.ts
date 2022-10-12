import jwt from 'jsonwebtoken';
import UserService from '../user/user.service';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export default class TokenController {
  constructor(private userService: UserService) {
    this.userService = new UserService();
  }

  public async generateAccessToken(userId: number) {
    const payload = { userId };
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    });

    return accessToken;
  }

  public async generateRefreshToken(userId: number) {
    const payload = { userId };

    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    });
    return refreshToken;
  }

  public async validateAccessToken(token, res: Response) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

      return userData;
    } catch (e) {
      res.status(StatusCodes.UNAUTHORIZED);
    }
  }

  public async validateRefreshToken(token, res: Response) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

      return userData;
    } catch (e) {
      res.status(StatusCodes.UNAUTHORIZED);
    }
  }
}
