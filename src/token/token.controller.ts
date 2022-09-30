import jwt from 'jsonwebtoken';
import UserService from '../user/user.service';

export default class TokenController {
  constructor(private userService: UserService) {
    this.userService = new UserService();
  }

  public async generateTokens(userId: number) {
    const payload = { userId };
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  public async saveToken(clientId: number, refreshToken: string) {
    const IdObj = { clientId: clientId as number };
    const refreshTokenObj = { refreshToken: refreshToken as string };
    const tokenData = await this.userService.getUser(IdObj);

    if (tokenData) {
      return this.userService.updateUserData(clientId, refreshTokenObj);
    }

    return this.userService.createRefreshToken(IdObj.clientId, refreshTokenObj.refreshToken);
  }
}
