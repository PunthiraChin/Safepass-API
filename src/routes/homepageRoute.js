const express = require("express");
const homepageController = require("../controllers/homepageController");
const homepageRouter = express.Router();

homepageRouter.get("/", homepageController.getAllEvents);
// homepageRouter.get((req, res, next) => {
//   res.status(200).json({ message: "In homepage route" });
// });

module.exports = homepageRouter;
