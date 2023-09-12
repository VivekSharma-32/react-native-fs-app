const express = require("express");
const {
  registerController,
  loginController,
  updateUserController,
  requireSignIn,
} = require("../controllers/userController");

// router
const router = express.Router();

// routes
// REGISTER || POST
router.post("/register", registerController);

// LOGIN || POST
router.post("/login", loginController);

// UPDATE || PUT
router.put("/update-user", requireSignIn, updateUserController);

module.exports = router;
