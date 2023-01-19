const express = require("express");
const userModel = require("../models/userModel");
const { signUp, login } = require("../controllers/authController");
const { body } = require("express-validator"); //named export

const router = express.Router();
router.post(
  "/signup",
  [
    body("name", "name should not be empty").trim().notEmpty(),
    body("password", "password should be of 5char min")
      .trim()
      .isLength({ min: 5 }),
    body("email", "please enter valid email")
      .isEmail()
      .trim()
      .custom((value) => {
        return userModel.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject(
              "E-Mail exists already, please pick a different one."
            );
          }
        });
      }),
  ],
  signUp
);
router.post("/login", login);

module.exports = router;
