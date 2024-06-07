const prisma = require("../models/prisma");
const eventService = {};

eventService.getAllEvents = () => prisma.event.findMany();
// eventService.getEventById = (eventId) =>
//   prisma.event.findUnique({ where: { id: eventId } });
// ยังไม่สามารถ join table tickettype มาได้
eventService.getEventById = (eventId) =>
  prisma.event.findUnique({
    where: { id: eventId },
    include: { ticketTypes: true },
  });

// get ticket details by event and ticket type
eventService.getTicketDetailsById = (ticketTypeId) =>
  prisma.tickettype.findFirst({
    where: { id: ticketTypeId },
  });

eventService.updateRemainingTicket = async (
  ticketTypeId,
  noOfBookedTickets
) => {
  const ticketTypeDetails = await eventService.getTicketDetailsById(
    ticketTypeId
  );
  console.log("ticketTypeDetails", ticketTypeDetails);
  let remainingSeat = +ticketTypeDetails.remainingSeat;
  remainingSeat = remainingSeat - noOfBookedTickets;
  return prisma.tickettype.update({
    data: { remainingSeat },
    where: { id: ticketTypeId },
  });
};
module.exports = eventService;
