const bcrypt = require("bcryptjs");
const hashService = {};
// Hash service
hashService.hash = (password) => bcrypt.hash(password, 10);
// Compare service
hashService.compare = (password, hashPassword) =>
  bcrypt.compare(password, hashPassword);

module.exports = hashService;
