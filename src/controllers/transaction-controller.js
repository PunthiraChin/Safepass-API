const { TXN_STATUS } = require("../constants");
const eventService = require("../services/event-service");
const nftService = require("../services/nft-service");
const transactionService = require("../services/transaction-service");

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
transactionController.completeTransaction = async (req, res, next) => {
  try {
    const txnId = +req.body.txnId;
    const eventId = +req.params.eventId;
    // 1. Update transaction status to completed and create ticket minting ID
    const updateTxnResult = await transactionService.updateCompleteTransaction(
      txnId
    );
    console.log("updateTxnResult", updateTxnResult);

    // 2. Create NFT records ตามจำนวน NFT ที่เข้ามา โดยใช้ ArrOfToken
    // inputData = txnId, tokenId, openseaUrl (contractAddress/tokenId)
    const eventDetails = await eventService.getEventById(eventId);
    console.log("eventDetails", eventDetails);
    let eventContractAddress = eventDetails.contractAddress;
    const arrOfTokenId = req.body.arrOfTokenId;

    console.log("arrOfTokenID", typeof arrOfTokenId);
    let createdNFT = [];
    for (let tokenId in arrOfTokenId) {
      let nftData = {};
      nftData.txnId = txnId;
      nftData.openSeaUrl = `https://testnets.opensea.io/${eventContractAddress}/${tokenId}`;
      nftData.tokenId = +tokenId;
      const result = await nftService.createNftRecord(nftData);
      createdNFT.push(result);
    }
    // ปั้น response data กลับไปให้ frontend
    res.status(200).json({ createdNFT, txnId });
  } catch (err) {
    console.log(err);
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
  }
};

module.exports = transactionController;
