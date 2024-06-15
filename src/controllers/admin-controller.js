const eventService = require("../services/event-service");
const upload = require("../middleware/upload");
const uploadService = require("../services/upload-service");
const convertDateTime = require("../utils/convert-datetime");
const createError = require("../utils/create-error");

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
  try {
    // req.user = userData; จะได้ข้อมูลของ admin มา
    // req.body คือรับข้อมูลที่ user กรอกมาจากหน้า frontend ที่เป็น text data
    // ค่าที่ส่งมา จะเป็น string ทั้งหมดนะ ต้อง convert กลับไปเป็นข้อมูลที่เราต้องการ e.g. array, object, number
    // req.files จะมีข้อมูล file ต่างๅ ที่ส่งเข้ามาจาก
    const uploadedFile = req.files;
    // upload file ขึ้น cloudniary แล้วเอา response กลับมา
    // เตรียม data เพื่อ create new event to database
    // เอาค่า input จาก form ที่เป็น text มาก่อน โดยต้องแปลงค่าจาก string เป็นค่าที่้เราต้องการ

    const promises = [];
    // upload ภาพทั้งหมดพร้อมๆ กัน แต่รอ result ให้เสร็จทั้งหมดแล้วค่อยไปบรรทัดถัดไป
    if (req.files.coverImage) {
      const result = uploadService
        .upload(req.files.coverImage[0].path)
        .then((url) => ({ url, key: "coverImage" }));
      promises.push(result);
      // เอาค่า URL จาก cloudinary เข้าไป update ที่ req.body เพื่อรอ update เข้า database
    }
    if (req.files.profileImage) {
      const result = uploadService
        .upload(req.files.profileImage[0].path)
        .then((url) => ({ url, key: "profileImage" }));
      promises.push(result);
    }
    if (req.files.seatMapImage) {
      const result = uploadService
        .upload(req.files.seatMapImage[0].path)
        .then((url) => ({ url, key: "seatMapImage" }));
      promises.push(result);
    }
    const result = await Promise.all(promises); // [{'url';'xxx',"key":"xxx"}, {'url';'xxx',"key":"xxx"},'url';'xxx',"key":"xxx"}]
    console.log("result from cloudinary upload", result);
    // res.status(200).json(result);
    const cloudinaryImageUrlObj = result.reduce((acc, item) => {
      acc[item.key] = item.url;
      return acc;
    }, {});
    // เอาข้อมูล url ที่ upload บน cloudinary มาเก็บใน array แล้ว
    // ==========================================
    console.log("Request Body", req.body);
    // เอา ticket types object ออกมาก่อน เพื่อทำเป็น arr of object แล้วยัดค่าใส่่กลับเข้าไปใน data อีกที
    const ticketTypeObj = req.body.ticketTypes;
    console.log("ticketTypeObj", ticketTypeObj);
    const ticketTypeArr = [];
    for (let key in ticketTypeObj) {
      if (key !== "") {
        ticketTypeArr.push(ticketTypeObj[key]);
      }
    }
    console.log("Final Tickettype array", ticketTypeArr);
    // req.body.ticketTypes = [...ticketTypeArr];
    console.log("request body- tickettypes", req.body.ticketTypes);
    const eventAndTicketTypeData = Object.assign(
      cloudinaryImageUrlObj,
      req.body
    );
    console.log("eventAndTicketTypeData", eventAndTicketTypeData);
    // convert datetime to correct format
    newStartDateTime = convertDateTime(eventAndTicketTypeData.startDateTime);
    newEndDateTime = convertDateTime(eventAndTicketTypeData.endDateTime);
    eventAndTicketTypeData.startDateTime = newStartDateTime;
    eventAndTicketTypeData.endDateTime = newEndDateTime;
    delete eventAndTicketTypeData;

    delete eventAndTicketTypeData.ticketTypes;
    // Create new event only
    const createEventResult = await eventService.createEvent(
      eventAndTicketTypeData
    );
    console.log("create event result", createEventResult); // ได้ eventId ออกมา
    // เพิ่มค่า event ID เข้าไปให้แต่ละ array object ก่อน
    // Create new ticket types based on the created event
    const eventId = createEventResult.id;
    const ticketTypeData = ticketTypeArr.map((ticketTypeObj) => {
      ticketTypeObj.maximumSeat = +ticketTypeObj.maximumSeat;
      ticketTypeObj.remainingSeat = +ticketTypeObj.remainingSeat;
      ticketTypeObj.price = +ticketTypeObj.price;
      ticketTypeObj.eventId = eventId;
      return ticketTypeObj;
    });
    const createTicketTypeResult = await eventService.createNewTicketType(
      ticketTypeData
    );
    console.log("create ticket type", createTicketTypeResult);
    // create new event to database
    // const createNewEventResult = await eventService.createNewEventAndTicketType(
    //   eventAndTicketTypeData
    // );
    // console.log("createNewEventResult", eventAndTicketTypeData);
    res.status(200).json({ createEventResult, createTicketTypeResult });
  } catch (err) {
    console.log(err);
    next(err);
    // }
  }
};
adminController.deleteEventById = async (req, res, next) => {
  try {
    const eventId = +req.params.eventId;
    console.log("event id", eventId);
    // 1: check ก่อนว่า event มันเลย start date ไปรียัง ถ้าเลย ให้ return error ไป ว่า delete ไมไ่ด้
    const eventDetails = await eventService.getEventById(eventId);
    if (!eventDetails) {
      return createError({
        message: "Cannot Find The requested Event",
        statusCode: 401,
      });
    }
    const currentDateTime = new Date();
    const currentDateTimeIso = convertDateTime(currentDateTime);
    console.log(
      "date compare result",
      new Date(eventDetails.startDateTime) < new Date(currentDateTimeIso)
    );
    if (new Date(eventDetails.startDateTime) < new Date(currentDateTimeIso)) {
      return createError({
        message: "Cannot delete event because event already started",
        statusCode: 401,
      });
    }
    const result = await eventService.deleteEventById(eventId);
    console.log("result from deleting event", result);
    res.status(200).json({ message: "Delete Event Successfully" });
  } catch (err) {
    console.log("Error from delete event", err);
  }
};
adminController.editEvent = async (req, res, next) => {
  try {
    await eventService.editEventById(eventId.data);
    res.status(200).json({ message: "In editing event" });
  } catch (err) {
    console.log("error from editing event", err);
  }
};
module.exports = adminController;
