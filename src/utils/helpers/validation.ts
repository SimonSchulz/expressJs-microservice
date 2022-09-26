/* eslint-disable import/prefer-default-export */
/* eslint-disable consistent-return */
/* eslint-disable no-useless-escape */
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { plainToInstance } from 'class-transformer';
import { Endpoints } from './constants';
import url from 'url';

export const requestValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  let data = formatDataToDto(req);

  validate(data, { skipMissingProperties: true }).then((errors) => {
    if (errors.length > 0) {
      let errorTexts = Array();
      for (const errorItem of errors) {
        errorTexts = errorTexts.concat(errorItem.constraints);
      }
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(errorTexts);
      return;
    } else {
      next();
    }
  });
};

function formatDataToDto(req: Request) {
  let clearUrl = url.parse(req.url).pathname;
  const data = req.method === 'GET' ? req.query : req.body;
  let formatedData = plainToInstance(Endpoints[clearUrl], data);
  return formatedData;
}
