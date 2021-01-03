const mongoose = require("mongoose");
const { isEmail } = require("validator");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please enter an email"],
      unique: true,
      validate: [isEmail, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
      minlength: [6, "Minimum password length is 6 characters"],
    },
    ouid: {
      required: [true, "Please enter a valid ou id"],
      type: Number,
      unique: true,
      minlength: 9,
      maxlength: 9,
    },
    displayName: { type: String },
    userType: {
      type: String,
      required: [true, "Please select a valid user role"],
    },
  },
  { timestamps: true, collection: "users" }
);

module.exports = mongoose.model("User", userSchema);
