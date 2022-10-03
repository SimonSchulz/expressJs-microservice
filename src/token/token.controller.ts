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

  public async saveToken(clientId: number, refreshToken: string) {
    const tokenData = await this.userService.getUser({ clientId });

    if (tokenData) {
      return this.userService.updateUserData(clientId, { refreshToken });
    }

    return this.userService.insertRefreshToken(clientId, refreshToken);
  }

  public setToken(res: Response, accessToken: string) {
    try {
      return res.cookie('accessToken', accessToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
    } catch (error) {
      throw Error('Incorrect token');
    }
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
