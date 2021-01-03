const express = require("express");
const router = express.Router();

const {
  signup,
  signin,
  logout,
  deleteUser,
} = require("../controllers/authController");

router.post("/register", signup);
router.post("/login", signin);
router.get("/logout", logout);
router.delete("/delete", deleteUser);

module.exports = router;
