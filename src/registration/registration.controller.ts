import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import UserService from '../user/user.service';
import RegistrationService from './registration.service';
import ClientStatus from '../utils/helpers/constants';
import { plainToClass } from 'class-transformer';
import UpdateDataDto from './dto/updateData.dto';

export default class SecurityController {
  constructor(private securityService: RegistrationService, private userService: UserService) {
    this.securityService = new RegistrationService();
    this.userService = new UserService();
  }

  public checkPhoneStatus = async (req: Request, res: Response) => {
    try {
      const phoneNumber = req.query.mobilePhone;

      const user = await this.userService.getUser(String(phoneNumber));

      if (user) {
        const clientStatus = user.clientStatus;

        switch (clientStatus) {
          case ClientStatus.ACTIVE:
          case ClientStatus.NOT_ACTIVE:
            return res.status(StatusCodes.CONFLICT).json({ msg: 'User is already a client' });

          case ClientStatus.NOT_REGISTER:
            return res
              .status(StatusCodes.OK)
              .json({ mobilePhone: phoneNumber, clientStatus: clientStatus, idCustomer: user.clientId });
        }
      } else return res.status(StatusCodes.OK).json({ mobilePhone: phoneNumber, msg: 'notClient' });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
    }
  };

  public updateUserProfile = async (req: Request, res: Response) => {
    try {
      const updateData = plainToClass(UpdateDataDto, req.body);
      const phoneNumber = updateData.mobilePhone;

      const user = await this.userService.getUser(String(phoneNumber));

      if (!user) return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'User not found' });

      if (user.clientStatus === ClientStatus.BLOCKED)
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Client is blocked' });

      this.userService.updateUser(user, updateData);

      return res.status(StatusCodes.OK).json({ msg: 'User updated successfully' });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
    }
  };
}
