const prisma = require("../models/prisma");
const userService = {};

userService.findUserByEmail = (email) =>
  prisma.user.findUnique({ where: { email: email } });
userService.findUserById = (userId) =>
  prisma.user.findUnique({ where: { id: id } });

userService.createNewUser = (userData) =>
  prisma.user.create({ data: userData });

userService.updateUserWalletAddress = (userId, walletAddress) => {
  return prisma.user.update({
    where: { id: userId },
    data: { walletAddress: walletAddress },
  });
};
userService.changePassword = (userId, newPassword) => {
  return prisma.user.update({
    where: { id: userId },
    data: { password: newPassword },
  });
};

module.exports = userService;
