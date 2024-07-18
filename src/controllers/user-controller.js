const hashService = require("../services/hash-service");
const transactionService = require("../services/transaction-service");
const userService = require("../services/user-service");
const createError = require("../utils/create-error");

const userController = {};

userController.getUserProfile = async (req, res, next) => {
  try {
    const userEmail = req.user.email;
    const userProfile = await userService.findUserByEmail(userEmail);
    delete userProfile.password;
    res.status(200).json({ userProfile });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
userController.getUserTransaction = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userTransactionArr =
      await transactionService.getAllTransactionsByUserId(userId);
    console.log("user transaction", userTransactionArr);
    res.status(200).json(userTransactionArr);
  } catch (err) {
    console.log(err);
    next(err);
  }
};
userController.changePassword = async (req, res, next) => {
  // call change password service
  console.log("request body", req.body);
  // get user data, including hashed password
  console.log("user data", req.user);
  // check if current password matches
  if (req.body.currentPassword) {
    const isPasswordMatch = await hashService.compare(
      req.body.currentPassword,
      req.user.password
    );
    if (!isPasswordMatch) {
      return createError({
        statusCode: 400,
        message: "Current Password is incorrect",
        field: "currentPassword",
      });
    }
    // hash password first
    const hashedPassword = await hashService.hash(req.body.newPassword);
    // call service to update password
    const changePasswordResult = await userService.changePassword(
      req.user.id,
      hashedPassword
    );
    console.log("change password result", changePasswordResult);
  }
  res.status(200).json("Change password successfully");
};
module.exports = userController;
