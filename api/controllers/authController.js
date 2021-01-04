const User = require("../models/user.model.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { createJWT } = require("../utils/auth");
const { json } = require("body-parser");

const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

exports.logout = (req, res, next) => {
  try {
    if (req.cookies.token) {
      res.clearCookie("token");
      return res.json({ msg: `User logged out` });
    } else {
      return res.json({
        msg: `No users currently logged in. Unable to logout`,
      });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.get_token = (req, res) => {
  try {
    if (req.cookies.token) {
      return res.status(200).json({ token: req.cookies.token });
    } else {
      return res.status(404).json({ msg: "No users logged in" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
};

exports.deleteUser = (req, res) => {
  if (req.cookies.token) {
    // if user logged in, clear token
    res.clearCookie("token");
  }
  let { id } = req.body;
  User.findByIdAndDelete(id, function (err) {
    if (err) console.log(err.message);
    console.log("Deletion successful");
  });
};

exports.signup = (req, res) => {
  let {
    email,
    password,
    passwordCheck,
    ouid,
    displayName,
    userType,
  } = req.body;

  // Validation checks
  if (!email || !password || !passwordCheck || !userType) {
    return res.status(400).json({ msg: "Not all fields have been entered." });
  } else if (password.length < 6) {
    return res
      .status(400)
      .json({ msg: "The password needs to be at least 6 characters long." });
  } else if (password !== passwordCheck) {
    return res
      .status(400)
      .json({ msg: "Enter the same password twice for verification." });
  } else if (!emailRegexp.test(email)) {
    return res.status(400).json({ msg: "Invalid email" });
  }

  // Built for your suffering
  if (userType === "resident") {
  } else if (userType === "nurse") {
  } else if (userType === "attendee") {
  } else if (userType === "admin") {
  } else if (userType === "superAdmin") {
  } else {
    return res.status(400).json({ msg: "Invalid user role" });
  }

  // Check to see if user exists, if not create
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ user: "Account already exists." }] });
      } else {
        // If no display name, then use email instead
        if (!displayName) displayName = email;

        // Create new user
        const user = new User({
          email: email,
          password: password,
          ouid: ouid,
          displayName: displayName,
          userType: userType,
        });

        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(password, salt, function (err, hash) {
            if (err) throw err;
            user.password = hash;
            user
              .save()
              .then((response) => {
                res.status(200).json({
                  success: true,
                  result: response,
                });
              })
              .catch((err) => {
                res.status(500).json({
                  errors: [{ error: err }],
                });
              });
          });
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        errors: [{ error: "Something went wrong" }],
      });
    });
};

exports.signin = (req, res) => {
  let { email, password } = req.body;

  // Validation checks
  if (!email || !password) {
    return res.status(400).json({ msg: "Not all fields have been entered." });
  }

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          errors: [{ user: "Account not found" }],
        });
      } else {
        bcrypt
          .compare(password, user.password)
          .then((isMatch) => {
            if (!isMatch) {
              return res.status(400).json({
                errors: [{ password: "Password is incorrect" }],
              });
            }

            let access_token = createJWT(
              user.email,
              user._id,
              process.env.TOKEN_LIFE
            );

            jwt.verify(
              access_token,
              process.env.TOKEN_SECRET,
              (err, decoded) => {
                if (err) {
                  res.status(500).json({ error: "Error in JWT verification" });
                }
                if (decoded) {
                  var httpOnly = process.env.COOKIE_HTTPONLY_PARAM === "true";
                  var sameSite = process.env.COOKIE_SAMESITE_PARAM === "true";
                  var secure = process.env.COOKIE_SECURE_PARAM === "true";
                  res.cookie("token", access_token, {
                    httpOnly: httpOnly,
                    sameSite: sameSite,
                    secure: secure,
                    maxAge: process.env.TOKEN_LIFE,
                  });
                  return res.status(200).json({
                    success: true,
                    token: access_token,
                    message: user,
                  });
                }
              }
            );
          })
          .catch((err) => {
            res.status(500).json({ error: "Error finding matching password" });
          });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: "Error finding account" });
    });
};
