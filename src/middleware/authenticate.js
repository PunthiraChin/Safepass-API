const { USER_ROLE } = require("../constants");
const jwtService = require("../services/jwt-service");
const userService = require("../services/user-service");
const createError = require("../utils/create-error");

const authenticate = {};
authenticate.customer = async (req, res, next) => {
  try {
    // 1. check if bearer token exists
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith("Bearer ")) {
      createError({ message: "unauthorized", statusCode: 401 });
    }
    // 2. check if valid bearer token
    const token = authorization.split(" ")[1];
    // jwt returns payload or error(>> enters catch block)
    const payload = jwtService.verify(token); // {email, role}
    if (payload.role !== USER_ROLE.CUSTOMER) {
      createError({ message: "not a customer", statusCode: 401 });
    }
    const userData = await userService.findUserByEmail(payload.email);
    // 3. return user data
    req.user = userData;
    // res.status(200).json({ userData });
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};
authenticate.admin = async (req, res, next) => {
  try {
    // 1. check if bearer token exists
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith("Bearer ")) {
      createError({ message: "unauthorized", statusCode: 401 });
    }
    // 2. check if valid bearer token
    const token = authorization.split(" ")[1];
    // jwt returns payload or error(>> enters catch block)
    const payload = jwtService.verify(token); // {email, role}
    if (payload.role !== USER_ROLE.ADMIN) {
      createError({ message: "not an admin", statusCode: 401 });
    }
    const userData = await userService.findUserByEmail(payload.email);
    // 3. return user data
    req.user = userData;
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};
authenticate.any = async (req, res, next) => {
  try {
    // 1. check if bearer token exists
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith("Bearer ")) {
      createError({ message: "unauthorized", statusCode: 401 });
    }
    // 2. check if valid bearer token
    const token = authorization.split(" ")[1];
    // jwt returns payload or error(>> enters catch block)
    const payload = jwtService.verify(token); // {email, role}
    const userData = await userService.findUserByEmail(payload.email);
    // 3. return user data
    req.user = userData;
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = authenticate;
