const transactionService = require("../services/transaction-service");
const userService = require("../services/user-service");

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
module.exports = userController;
