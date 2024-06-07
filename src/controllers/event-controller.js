const eventService = require("../services/event-service");

const eventController = {};

eventController.getEventDetails = async (req, res, next) => {
  try {
    const eventId = +req.params.eventId;
    console.log("event ID", eventId);
    const result = await eventService.getEventById(eventId);
    console.log("get event by ID result:", result);
    res.status(200).json({ message: result });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
module.exports = eventController;
