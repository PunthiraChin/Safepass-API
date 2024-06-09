const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/user-controller");
const authenticate = require("../middleware/authenticate");

userRouter.get(
  "/profile",
  authenticate.customer,
  userController.getUserProfile
);
userRouter.get(
  "/transactions",
  authenticate.customer,
  userController.getUserTransaction
);
// แก้ไข profile ของ user
// userRouter.patch("/:userId/profile")
module.exports = userRouter;
