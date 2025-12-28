const authctrl = require("../controllers/Auth");
const express = require("express");
//creating a router
const router = express.Router();
//post
router.post("/register", authctrl.CreateAuth);
router.post("/login", authctrl.Login);
router.get("/me", authctrl.me);

module.exports = router;
