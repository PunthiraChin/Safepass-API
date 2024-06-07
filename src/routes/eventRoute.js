const express = require("express");
const transactionController = require("../controllers/transaction-controller");
const eventController = require("../controllers/event-controller");
const authenticate = require("../middleware/authenticate");
const eventRouter = express.Router();

eventRouter.get("/:eventId", eventController.getEventDetails);
eventRouter.post(
  "/:eventId/checkout",
  authenticate.customer,
  transactionController.createTransaction
);
eventRouter.patch(
  "/:eventId/checkout",
  authenticate.customer,
  transactionController.completeTransaction
);
eventRouter.get(
  "/:eventId/checkout/transaction/:txnId",
  authenticate.customer,
  transactionController.getTransactionDetailsById
);
module.exports = eventRouter;
