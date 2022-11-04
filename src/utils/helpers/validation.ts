import url from 'url';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { plainToInstance } from 'class-transformer';

import { Endpoints } from './constants';

export const requestValidationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const data = formatDataToDto(req);
  await validate(data, { skipMissingProperties: true }).then((errors) => {
    if (errors.length > 0) {
      let errorTexts = [];
      for (const errorItem of errors) {
        errorTexts = errorTexts.concat(errorItem.constraints);
      }
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorTexts);
      return;
    } else {
      next();
    }
  });
};

function formatDataToDto(req: Request) {
  const clearUrl = url.parse(req.url).pathname;
  const data = req.method === 'GET' ? req.query : req.body;
  const formatedData = plainToInstance(Endpoints[clearUrl], data);
  return formatedData;
}
