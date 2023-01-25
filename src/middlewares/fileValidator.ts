import { NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { TypedRequestBody } from '../utils/tokenMiddleware';
import { messages } from '../utils/helpers/messages';

const allowedFiles = ['png', 'jpeg', 'jpg'];
const allowedFileTypes = ['image/png', 'image/jpeg', 'image/jpg'];

export const fileValidator = async (req: TypedRequestBody, res: Response, next: NextFunction) => {
  try {
    const { file } = req.files;
    const fileExtension = file.name.slice(file.name.lastIndexOf('.') + 1);

    if (!allowedFiles.includes(fileExtension) || !allowedFileTypes.includes(file.mimetype)) {
      return res.status(StatusCodes.BAD_REQUEST).json({ msg: messages.INVALID_FILE_EXTENSION });
    }

    req.fileExtension = fileExtension;
    next();
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
  }
};
