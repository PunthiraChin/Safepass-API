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
adminController.createNewEvent = async (req, res, next) => {
  // req.user = userData; จะได้ข้อมูลของ admin มา
  // req.body คือรับข้อมูลที่ user กรอกมาจากหน้า frontend
  const eventAndTicketTypeData = req.body;
  try {
    const createNewEventResult = await eventService.createNewEventAndTicketType(
      eventAndTicketTypeData
    );
    console.log(eventAndTicketTypeData);
    res.status(200).json({ createNewEventResult });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
module.exports = adminController;
