const Joi = require("joi");
exports.registerSchema = Joi.object({
  email: Joi.string().required().email({ tlds: false }),
  password: Joi.string()
    .pattern(/^[0-9a-zA-Z]{6,}$/)
    .when("googleId", {
      is: Joi.exist(),
      then: Joi.forbidden(),
      otherwise: Joi.required(),
    }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).strip(),
  googleId: Joi.string(),
  //   googleId: Joi.string().when("password", {
  //     is: Joi.exist(),
  //     then: Joi.forbidden(),
  //     otherwise: Joi.required(),
  //   }),
  firstName: Joi.string().required().trim(),
  lastName: Joi.string().required().trim(),
});
// Easy pattern
// Difficult pattern
// /^(?=[a-zA-Z0-9])(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?`~])[a-zA-Z0-9!@#$%^&*()_+[\]{};':"\\|,.<>/?`~]{8,20}$/

// Login - check required only
exports.loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().when("googleId", {
    is: Joi.exist(),
    then: Joi.forbidden(),
    otherwise: Joi.required(),
  }),
  googleId: Joi.string(),
});
