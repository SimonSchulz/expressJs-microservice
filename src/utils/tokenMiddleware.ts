import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { messages } from './helpers/messages';

export interface TypedRequestBody extends Request {
  userDecodedData?: any;
  files?: any;
}

function checkAccessToken(req: TypedRequestBody, res: Response, next: NextFunction) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: messages.USER_NOT_AUTHORIZED });
    }

    const token = authorization.split(' ')[1];
    const decodedData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.userDecodedData = decodedData;

    next();
  } catch (err) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: err });
  }
}

export default checkAccessToken;
