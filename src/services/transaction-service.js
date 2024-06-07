const { TXN_STATUS } = require("../constants");
const prisma = require("../models/prisma");
const transactionService = {};

transactionService.createTransaction = (data) =>
  prisma.transaction.create({ data: data });
transactionService.updateCompleteTransaction = (txnId) =>
  prisma.transaction.update({
    data: { txnStatus: TXN_STATUS.SUCCESS },
    where: { id: txnId },
  });
transactionService.getTransactionById = (txnId) =>
  prisma.transaction.findUnique({
    where: { id: txnId },
    include: { nftIds: true },
  });
module.exports = transactionService;
