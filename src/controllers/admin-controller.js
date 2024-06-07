const eventService = require("../services/event-service");

const adminController = {};
adminController.getAllEvents = async (req, res, next) => {
  try {
    const result = await eventService.getAllEvents();
    res.status(200).json({ message: result });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
adminController.getEventById = async (req, res, next) => {
  try {
    const eventId = +req.params.eventId;
    const result = await eventService.getEventById(eventId);
    res.status(200).json({ message: result });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
module.exports = adminController;
