const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator"); //named export

exports.signUp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed!");
    error.statusCode = 422;
    error.data = errors.array();
    next(error);
  }
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    // .then((hashedPassword) => {
    const user = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
    });
    const response = await user.save();
    // })
    // .then((response) => {
    res.status(201).json({
      message: "user created",
      userId: response._id,
    });
    // })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 401;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  try {
    const user = await userModel.findOne({ email: email });
    // .then((user) => {
    if (!user) {
      res.status(401).json({
        message: "user does not exist",
      });
    }
    loadedUser = user;
    const doMatch = await bcrypt.compare(password, user.password);
    // })
    // .then((doMatch) => {
    if (!doMatch) {
      const error = new Error("Wrong password.");
      error.statusCode = 401;
      return next(error);
    }

    const jwtToken = jwt.sign(
      {
        email: loadedUser.email,
        name: loadedUser.name,
        userId: loadedUser._id.toString(),
      },
      "secrectKeySubhasree",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      token: jwtToken,
      message: "Loggin succesfully",
    });
    // })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
