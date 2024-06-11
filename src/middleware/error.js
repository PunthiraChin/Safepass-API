const { JsonWebTokenError, TokenExpiredError } = require("jsonwebtoken");
const errorMiddleware = (err, req, res, next) => {
  console.log("error:", err);
  if (err instanceof JsonWebTokenError || err instanceof TokenExpiredError) {
    err.statusCode = 401;
  }
  // ส่ง status ออกไปก่อน แล้วเอา error ที่เกิดขึ้น มา extract message ออกมาแสดง
  res
    .status(err.statusCode || 500)
    .json({ message: err.message, field: err.field });
};
module.exports = errorMiddleware;
