const express = require("express");
const router = express.Router();

const {
  signup,
  signin,
  logout,
  deleteUser,
  get_token,
  refresh_token,
  getUserData,
} = require("../controllers/authController");

router.post("/register", signup);
router.post("/login", signin);
router.post("/refreshtoken", refresh_token);
router.get("/logout", logout);
router.get("/getToken", get_token);

module.exports = router;
