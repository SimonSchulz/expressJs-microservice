/* eslint-disable import/prefer-default-export */
/* eslint-disable consistent-return */
/* eslint-disable no-useless-escape */
import { NextFunction, Request, Response } from 'express';
import { query, validationResult, body } from 'express-validator';
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

export const checkVerificationCodeMiddleware = [
  body('mobilePhone')
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
  body('verificationCode')
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage('Required')
    .bail()
    .matches(/^\d+$/)
    .withMessage('Can contain only digits')
    .bail()
    .isLength({ min: 6, max: 6 })
    .withMessage('Must be 6 symbols'),
  body('id')
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage('Required')
    .bail()
    .matches(/^[a-zA-Zа-яА-Я0-9\@\!#\$%&‘\*\+-\/\\=\?\^_`{\|}~!»№;%:\?\*\(\)[\]<>,\.]+$/)
    .withMessage("Can contain letters, numbers, !@#$%^&*()_-=+;'?,<>[]{}|/#!~' symbols")
    .bail()
    .isLength({ min: 2 })
    .withMessage('Must be 2 symbols or more')
    .isLength({ max: 40 })
    .withMessage('Must be 40 characters or less'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }
    next();
  },
];
