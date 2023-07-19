/**
 * @fileoverview user router
 * @baseURL /user
 * Global User objet
 * @typedef {import("../models/UserModel").User} User
 */
const express = require("express");
const userServices = require("../services/userServices");
const passport = require("../services/passport");

const router = express.Router();

/**
 * @description create user
 * @route POST /user/signup
 * @returns {User} user object
 */
router.post("/signup", async (req, res, next) => {
  try {
    const newUser = req.body.user;
    invalid = await userServices.validatePassword(newUser.password);
    if (invalid) {
      res.status(400).send({ message: invalid.message });
    } else {
      const responseUser = await userServices.create({ ...newUser });
      res.status(201).send(responseUser);
    }
  } catch (error) {
    next(error);
  }
});

/**
 * Sign in a user by email and password
 * @route POST /user/signin
 * @return {User} user object
 */
router.post("/signin", async (req, res, next) => {
  passport.authenticate("local", (error, user) => {
    if (error || !user) {
      res.status(403).send({
        message: "Please ensure your username and password are correct.",
      });
    } else {
      req.logIn(user, (error) => {
        if (error) {
          next(error);
        } else {
          res.status(200).send({
            message: "successfully signed in",
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
router.post("/signout", async (req, res, next) => {
  const user = req.user;
  req.logout((error) => {
    if (error) {
      next(error);
    } else {
      res.status(200).send({
        message: "Successful Logout by user " + user.id,
        user,
      });
    }
  });
});

module.exports = router;
