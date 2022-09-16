/* eslint-disable import/prefer-default-export */
/* eslint-disable consistent-return */
/* eslint-disable no-useless-escape */
import { NextFunction, Request, Response } from 'express';
import { query, validationResult, param, body } from 'express-validator';
import { StatusCodes } from 'http-status-codes';

export const registrationDataValidator = [
  body('mobilePhone')
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage('mobile phone is required')
    .bail()
    .matches(/^\d+$/)
    .withMessage('Can contain only digits')
    .bail()
    .isLength({ min: 11, max: 11 })
    .withMessage('Must be 11 digits')
    .bail(),

  body('password')
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage('Password is required')
    .bail()
    .isLength({ min: 8 })
    .withMessage('Short password.Must be 8 symbols or more')
    .bail(),

  body('securityQuestion').exists({ checkFalsy: true, checkNull: true }).withMessage('Required').isString(),

  body('securityAnswer').exists({ checkFalsy: true, checkNull: true }).withMessage('Required').isString(),

  body('firstName')
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage('Required')
    .isString()
    .isLength({ min: 2 }),

  body('secondName')
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage('Required')
    .isString()
    .isLength({ min: 2 }),

  body('passportNumber')
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage('Required')
    .isString()
    .isLength({ min: 2 }),

  body('countryOfResidence').isBoolean(),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }
    next();
  },
];

export const phoneNumberValidator = [
  query('mobilePhone')
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

export const updateDataValidator = [
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

  body('password')
    .exists({ checkFalsy: true, checkNull: true })
    .withMessage('Password is required')
    .bail()
    .isLength({ min: 8 })
    .withMessage('Short password.Must be 8 symbols or more')
    .bail(),

  body('securityQuestion').exists({ checkFalsy: true, checkNull: true }).withMessage('Required').isString(),

  body('securityAnswer').exists({ checkFalsy: true, checkNull: true }).withMessage('Required').isString(),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }
    next();
  },
];
