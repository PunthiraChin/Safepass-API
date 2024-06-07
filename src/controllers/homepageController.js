const eventService = require("../services/event-service");

const homepageController = {};
homepageController.getAllEvents = async (req, res, next) => {
  try {
    const result = await eventService.getAllEvents();
    console.log("get all event result", result);
    res.status(200).json({ message: result });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
module.exports = homepageController;
