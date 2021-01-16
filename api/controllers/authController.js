const User = require("../models/user.model.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { createJWT } = require("../utils/auth");

const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

exports.refresh_token = (req, res) => {
  let { email } = req.body;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          errors: [{ user: "Account not found" }],
        });
      } else {
        let access_token = createJWT(
          user.email,
          user._id,
          process.env.TOKEN_LIFE
        );

        jwt.verify(access_token, process.env.TOKEN_SECRET, (err, decoded) => {
          if (err) {
            res.status(500).json({ error: "Error in JWT verification" });
          }
          if (decoded) {
            return res.status(200).json({
              token: access_token,
            });
          }
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: "Error finding account" });
    });
};

exports.getUserData = (req, res) => {
  let { email } = req.body;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          errors: [{ user: "Account not found" }],
        });
      } else {
        return res.status(200).send(user);
      }
    })
    .catch((err) => {
      return res.status(500).json({
        errors: [{ user: "There was a problem finding the user" }],
      });
    });
};

exports.logout = (req, res) => {
  try {
    if (req.cookies.jwt) {
      res.clearCookie("jwt");
      // res.redirect("/");
      return res.json({ msg: `User logged out and cookie cleared` });
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
  let { email } = req.body;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          errors: [{ user: "Account not found" }],
        });
      } else {
        User.findByIdAndDelete(user.id, function (err) {
          if (err) {
            return res.status(500).json({ erorrs: err.message });
          } else {
            return res.status(200).json({ user: "Deletion Successful" });
          }
        });
      }
    })
    .catch((err) => {
      return res.status(500).json({
        errors: [{ user: "There was a problem finding the user" }],
      });
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
    adminSecret,
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
  } else if (userType === "admin" && adminSecret === process.env.ADMIN_SECRET) {
  } else if (
    userType === "superAdmin" &&
    adminSecret === process.env.ADMIN_SECRET
  ) {
  } else {
    return res.status(402).json({ msg: "Invalid user role" });
  }

  // Check to see if user exists, if not create
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        return res
          .status(409)
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
              return res.status(401).json({
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
