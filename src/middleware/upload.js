const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    console.log(file);
    // สร้างชื่อไฟล์ โดยเพิ่มสกุลของไฟล์ให้ถูกต้อง (ข้อมูลมาจาห file object จะมี key ชื่อ mimetype ที่ให้ 'image/jpeg/)
    const filename =
      new Date().getTime() +
      "" +
      Math.round(Math.random() * 10000) +
      "." +
      file.mimetype.split("/")[1];
    cb(null, filename);
  },
});
const upload = multer({ storage });

module.exports = upload;
