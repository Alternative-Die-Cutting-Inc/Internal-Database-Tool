/**
 * @fileoverview user router
 * @baseURL /user
 * Global User objet
 * @typedef {import("../models/UserModel").User} User
 */
const express = require('express');
const userServices = require('../services/userServices');
const passport = require('../services/passport');
const checkLoggedIn = require('../middlewares/checkLoggedIn');

const router = express.Router();

/**
 * Get all users.
 * @route GET /user
 * @return {User[]} user object
 */
router.get('/', checkLoggedIn, async (req, res, next) => {
  try {
    const users = await userServices.getAll();
    res.status(200).send({ users });
  } catch (error) {
    next(error);
  }
});

/**
 * @description create user
 * @route POST /user/signup
 * @returns {User} user object
 */
router.post('/signup', async (req, res, next) => {
  try {
    const newUser = req.body.user;
    await userServices.validateUser(newUser.username, newUser.password);
    const newUsersList = await userServices.create({ ...newUser });
    res.status(201).send({ users: newUsersList });
  } catch (error) {
    next(error);
  }
});

/**
 * Sign in a user by email and password
 * @route POST /user/signin
 * @return {User} user object
 */
router.post('/signin', async (req, res, next) => {
  passport.authenticate('local', (error, user) => {
    if (error) {
      next(new Error('UNABLE_TO_AUTHENTICATE_USER', { cause: error }));
    } else if (!user) {
      next(new Error('INVALID_CREDENTIALS'));
    } else {
      req.logIn(user, (error) => {
        if (error) {
          next(error);
        } else {
          res.status(200).send({
            message: 'successfully signed in',
            user: user,
          });
        }
      });
    }
  })(req, res, next);
});

/**
 * Sign out the currently authenticated user.
 * @route POST /user/signout
 * @return {User} user object
 */
router.post('/signout', async (req, res, next) => {
  const user = req.user;
  req.logout((error) => {
    if (error) {
      next(error);
    } else {
      res.status(200).send({
        message: 'Successful Logout by user ' + user.id,
        user,
      });
    }
  });
});

/**
 * Get the currently authenticated user.
 * @route GET /user/info
 * @return {User} user object
 */
router.get('/info', checkLoggedIn, async (req, res, next) => {
  let user = req.user;
  res.status(200).send({ user: user });
});

module.exports = router;
