const { TXN_STATUS } = require("../constants");
const eventService = require("../services/event-service");
const nftService = require("../services/nft-service");
const transactionService = require("../services/transaction-service");
const createError = require("../utils/create-error");

const transactionController = {};

/// 1. create transaction in database
// input ที่ต้องรับมา = userId, eventId, ticketType, noOfTicket
// Data ที่ต้องปั้นให้กับ prisma = userId, eventId, ticketType, noOfTicket, totalPrice, txnStatus (default= Pending)
// response: success with txn details
transactionController.createTransaction = async (req, res, next) => {
  try {
    // req.user จะมี user data ทั้งหมด
    // req.body จะมีค่าที่จำเป็นกับ txn
    // get ticket details by ID
    const ticketDetails = await eventService.getTicketDetailsById(
      req.body.ticketTypeId
    );
    // Condition to check if tickets are still available or not
    if (ticketDetails.remainingSeat < req.body.ticketAmount) {
      return createError({ statusCode: 402, message: "Tickets Are Sold Out" });
    }
    const totalPrice = req.body.ticketAmount * ticketDetails.price;
    const txnInitiatingData = {
      userId: req.user.id,
      eventId: +req.params.eventId,
      ticketTypeId: req.body.ticketTypeId,
      ticketAmount: req.body.ticketAmount,
      totalPrice: totalPrice,
      txnStatus: TXN_STATUS.PENDING,
    };

    const txnCreateResult = await transactionService.createTransaction(
      txnInitiatingData
    );
    // get TicketType details กลับไปให้กับ Front end เพื่อไปใช้งานต่อด้วย โดยเอา ticketTypeId ไปเรียกต่อ
    const ticketTypeDetails = await eventService.getTicketDetailsById(
      txnCreateResult.ticketTypeId
    );
    txnCreateResult.ticketTypeDetails = ticketTypeDetails;

    const updateRemainingTicket = await eventService.updateRemainingTicket(
      req.body.ticketTypeId,
      req.body.ticketAmount
    );
    // Update Remaining ticket for that zone
    console.log("updateRemainingTicket", updateRemainingTicket);
    res.status(200).json({ txnCreateResult });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
transactionController.updateTransaction = async (req, res, next) => {
  try {
    console.log("Request Body", req.body);
    const txnId = +req.body.txnId;
    const eventId = +req.params.eventId;
    const txnStatus = req.body.txnStatus;
    // 1. Update transaction status to completed and create ticket minting ID
    console.log("Request body for update txn status", txnStatus);
    const updateTxnResult = await transactionService.updateTxnStatus(
      txnId,
      txnStatus
    );
    console.log("updateTxnResult", updateTxnResult);
    // ถ้า txn status เป็น faild >> response กลับเลย ไม่สร้าง NFT ต่อ
    if (txnStatus === TXN_STATUS.FAILED) {
      return res.status(200).json(updateTxnResult);
    }
    // 2. Create NFT records ตามจำนวน NFT ที่เข้ามา โดยใช้ ArrOfToken
    // inputData = txnId, tokenId, openseaUrl (contractAddress/tokenId)
    const eventDetails = await eventService.getEventById(eventId);
    console.log("eventDetails", eventDetails);
    let eventContractAddress = eventDetails.contractAddress;
    const arrOfTokenId = req.body.arrOfTokenId;
    let createdNFT = [];
    for (let tokenId of arrOfTokenId) {
      let nftData = {};
      nftData.txnId = txnId;
      nftData.openSeaUrl = `https://testnets.opensea.io/assets/amoy/${eventContractAddress}/${tokenId}`;
      nftData.tokenId = +tokenId;
      const result = await nftService.createNftRecord(nftData);
      createdNFT.push(result);
    }
    // ปั้น response data กลับไปให้ frontend
    res.status(200).json({ createdNFT, txnId });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
transactionController.getTransactionDetailsById = async (req, res, next) => {
  try {
    const eventId = +req.params.eventId;
    const txnId = +req.params.txnId;
    const transactionDetails = await transactionService.getTransactionById(
      txnId
    );
    res.status(200).json({ transactionDetails });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = transactionController;
