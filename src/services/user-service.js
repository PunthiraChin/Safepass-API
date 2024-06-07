const prisma = require("../models/prisma");
const userService = {};

userService.findUserByEmail = (email) =>
  prisma.user.findUnique({ where: { email: email } });

userService.createNewUser = (userData) =>
  prisma.user.create({ data: userData });

module.exports = userService;
