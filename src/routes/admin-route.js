const express = require("express");
const adminController = require("../controllers/admin-controller");
const authenticate = require("../middleware/authenticate");
const upload = require("../middleware/upload");
const { validateUploadImage } = require("../middleware/validator");
const adminRouter = express.Router();
adminRouter.get("/", authenticate.admin, adminController.getAllEvents);
adminRouter.get(
  "/event/:eventId",
  authenticate.admin,
  adminController.getEventById
);
adminRouter.post(
  "/events",
  authenticate.admin,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "profileImage", maxCount: 1 },
    { name: "seatMapImage", maxCount: 1 },
  ]),
  validateUploadImage,
  adminController.createNewEvent
);
adminRouter.delete(
  "/events/:eventId",
  authenticate.admin,
  adminController.deleteEventById
);
adminRouter.put(
  "/events/:eventId",
  authenticate.admin,
  adminController.editEventAndTicketType
);

module.exports = adminRouter;
