const { rateLimit } = require("express-rate-limit");
// สร้าง object ในการที่จะ กำหนด limit ขึ้นมา
const limiter = rateLimit({
  windowMs: 10 * 1000 * 60,
  limit: 100,
  message: { message: "too many request in a given period" },
});
module.exports = limiter;
