const express = require("express");
const adminController = require("../controllers/admin-controller");
const authenticate = require("../middleware/authenticate");
const adminRouter = express.Router();
adminRouter.get("/", authenticate.admin, adminController.getAllEvents);
adminRouter.get(
  "/event/:eventId",
  authenticate.admin,
  adminController.getEventById
);
adminRouter.post("/events", authenticate.admin, adminController.createNewEvent);

module.exports = adminRouter;