const express = require("express");
const authController = require("../controllers/auth-controller");
const authenticate = require("../middleware/authenticate");
const {
  registerValidator,
  loginValidator,
} = require("../middleware/validator");
const authRouter = express.Router();

authRouter.post("/register", registerValidator, authController.register);
authRouter.post("/login", loginValidator, authController.login);
authRouter.get("/getMe", authenticate.any, authController.getMe);
module.exports = authRouter;
