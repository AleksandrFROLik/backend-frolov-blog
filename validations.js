import {body} from 'express-validator';

export const loginValidation = [
  body('email', 'Not validate email').isEmail(),
  body('password', 'Password must be minimize 5 symbols').isLength({min: 5}),
];

export const registerValidation = [
  body('email', 'Not validate email').isEmail(),
  body('password', 'Password must be minimize 5 symbols').isLength({min: 5}),
  body('fullName', 'Enter name').isLength({min: 3}),
  body('avatarUrl', 'Link isn`t correct').optional().isURL(),
];
export const postCreateValidation = [
  body('title', 'Enter title the article').isLength({min: 3}).isString(),
  body('text', 'Enter text').isLength({min: 10}).isString(),
  body('tags', 'Format is not correct').optional().isString(),
  body('imageUrl', 'Link isn`t correct').optional().isString(),
];