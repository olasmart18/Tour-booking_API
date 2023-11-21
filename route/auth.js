const express = require("express");
const {
  createUser,
  login,
  googleAuth,
  googleAuthCallBack,
  logout,
} = require("../controllers/auth");
const router = express.Router();

router.post("/api/auth/register", createUser);
router.post("/api/auth/admin/register", createUser); //admin route
router.post("/api/auth/login", login);
router.get("/api/auth/logout", logout);
router.get("/auth/google", googleAuth);
router.get("/auth/google/callback", googleAuthCallBack);

module.exports = router;
