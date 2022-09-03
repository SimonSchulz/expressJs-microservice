/* eslint-disable import/prefer-default-export */
/* eslint-disable consistent-return */
/* eslint-disable no-useless-escape */
import { NextFunction, Request, Response } from 'express';
import { query, validationResult } from 'express-validator';
import { StatusCodes } from 'http-status-codes';

export const requestValidationMiddleware = [
  query('receiver')
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage('Required')
    .bail()
    .matches(/^\d+$/)
    .withMessage('Can contain only digits')
    .bail()
    .isLength({ min: 8 })
    .withMessage('Must be 8 symbols or more')
    .isLength({ max: 15 })
    .withMessage('Must be 15 symbols or less'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }
    next();
  },
];
