const { registerSchema, loginSchema } = require("../validators/auth-validator");

// รับ input จาก registration, login เข้ามา validate ก่อนส่งให้ middleware อื่นๆ ทำงานต่อ
exports.registerValidator = (req, res, next) => {
  const { value, error } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  // เราเอา confirm password ออกไปจาก body หลัง validate ด้วย joi
  req.input = value;
  //   res.status(200).json({ message: req.input });
  next();
};

exports.loginValidator = (req, res, next) => {
  const { value, error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  req.input = value;
  //   res.status(200).json({ message: req.input });
  next();
};
