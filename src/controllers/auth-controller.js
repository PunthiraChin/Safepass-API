const { USER_ROLE } = require("../constants");
const hashService = require("../services/hash-service");
const jwtService = require("../services/jwt-service");
const userService = require("../services/user-service");
const createError = require("../utils/create-error");

const authController = {};
authController.register = async (req, res, next) => {
  try {
    // 1. เช็คก่อนว่า user exist in the system ? ถ้าใช่ return error "user already exist" .=h prisma search by email
    const userExist = await userService.findUserByEmail(req.input.email);
    if (userExist) {
      createError({
        statusCode: 400,
        message: "user email already in use",
        field: "email",
      });
    }
    // เอา user input เข้ามา แล้วเพิ่ม role ให้กับ user
    let userData = { ...req.input, role: USER_ROLE.CUSTOMER };

    // 2. ถ้าเป็นเคสที่ไม่ใช่ google ID (มี password) ยังไม่มี user ให้ hash password เอาไว้ก่อน
    if (userData.password) {
      const hashedPassword = await hashService.hash(req.input.password);
      userData = { ...userData, password: hashedPassword };
    }
    console.log("userData", userData);
    // 3. เอา user ไป register ในระบบ
    const registerResult = await userService.createNewUser(userData);
    console.log("Register result", registerResult);
    res.status(200).json({ message: "register successful" });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

authController.login = async (req, res, next) => {
  try {
    // 1. check user by email if exists >> if not return error
    const userData = await userService.findUserByEmail(req.input.email);
    console.log("userData", userData);
    if (!userData) {
      return createError({
        statusCode: 401,
        message: "Invalid Credentials",
      });
    }
    // 2. check if password exists >> compare password to hashpassword
    if (req.input.password) {
      const isPasswordMatch = await hashService.compare(
        req.input.password,
        userData.password
      );
      if (!isPasswordMatch) {
        return createError({ statusCode: 401, message: "Invalid Credentials" });
      }
    }
    // 3. compare success >> create JWT token and return Token to user
    const payload = { email: userData.email, role: userData.role };
    const accessToken = jwtService.sign(payload);
    if (userData.role === USER_ROLE.CUSTOMER) {
      res.status(200).json({ accessToken, role: "CUSTOMER" });
    } else if (userData.role === USER_ROLE.ADMIN) {
      res.status(200).json({ accessToken, role: "ADMIN" });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};
authController.getMe = async (req, res, next) => {
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
module.exports = authController;
