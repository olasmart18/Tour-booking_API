const express = require ("express");
const { createUser, login } = require ("../controllers/auth");
const router = express.Router();

router.post("/register", createUser)
router.post("/admin/register", createUser) //admin route
router.post("/login", login)

module.exports = router;