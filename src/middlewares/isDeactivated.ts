import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import UserService from '../user/user.service';
import { loginTypes } from '../utils/helpers/constants';
import { messages } from '../utils/helpers/messages';

export const isDeactivated = async (req: Request, res: Response, next: NextFunction) => {
  const { type, login } = req.body;
  const user =
    type === loginTypes.email
      ? await new UserService().getUser({ email: login.toLowerCase() })
      : await new UserService().getUser({ passportId: login });

  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ msg: messages.USER_DOESNT_EXIST });
  } else {
    user.isDeactivated
      ? res.status(StatusCodes.FORBIDDEN).json({ login, msg: messages.CLIENT_IS_DEACTIVATED })
      : next();
  }
};
