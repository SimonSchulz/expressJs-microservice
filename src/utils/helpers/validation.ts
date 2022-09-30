/* eslint-disable import/prefer-default-export */
/* eslint-disable consistent-return */
/* eslint-disable no-useless-escape */
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
<<<<<<< HEAD
import { query, validationResult, body } from 'express-validator';
=======
>>>>>>> fb7e0da814887616526b11f7a8dc3e22b4b531d5
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
<<<<<<< HEAD
    next();
  },
];

export const loginMiddleware = [
  body(['login', 'password'])
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage('Required')
    .bail()
    .matches(/^[a-zA-Zа-яА-Я0-9\!#\$%&‘\*\+-\/\\=\?\^_`{\|}~!»№;%:\?\*\(\)[\]<>,\.]+$/)
    .withMessage("Can contain letters, numbers, !@#$%^&*()_-=+;'?,<>[]{}|/#!~' symbols")
    .bail()
    .isLength({ min: 2 })
    .withMessage('Must be 2 symbols or more')
    .isLength({ max: 30 })
    .withMessage('Must be 30 characters or less'),
];
=======
  });
};

function formatDataToDto(req: Request) {
  let clearUrl = url.parse(req.url).pathname;
  const data = req.method === 'GET' ? req.query : req.body;
  let formatedData = plainToInstance(Endpoints[clearUrl], data);
  return formatedData;
}
>>>>>>> fb7e0da814887616526b11f7a8dc3e22b4b531d5
