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
// อาจจะเลือกมาเฉพาะ ข้อมูลจาก event กับ tickettype ที่เราอยากได้ ไม่ต้องให้ join มาทุกๆ column
// transactionService.getAllTransactionsByUserId = (userId) =>
//   prisma.transaction.findMany({
//     where: { userId: userId },
//     include: { event: true, ticketType: true },
//   });
transactionService.getAllTransactionsByUserId = (userId) =>
  prisma.transaction.findMany({
    where: { userId: userId },
    include: {
      event: { select: { name: true } },
      ticketType: { select: { name: true, price: true } },
      nftIds: { select: { openSeaUrl: true } },
    },
  });

module.exports = transactionService;
