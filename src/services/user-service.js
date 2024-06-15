const prisma = require("../models/prisma");
const userService = {};

userService.findUserByEmail = (email) =>
  prisma.user.findUnique({ where: { email: email } });
userService.findUserById = (userId) =>
  prisma.user.findUnique({ where: { id: id } });
  
userService.createNewUser = (userData) =>
  prisma.user.create({ data: userData });

module.exports = userService;
