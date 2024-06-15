const cloudinary = require("../config/cloudinary");

const uploadService = {};
// ให้ return แค่ค่า secureUrl มาจาก return ของ cloudnary
uploadService.upload = async (path) => {
  const { secure_url } = await cloudinary.uploader.upload(path);
  return secure_url;
};

module.exports = uploadService;
