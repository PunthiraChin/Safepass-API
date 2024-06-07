const nftService = {};
const prisma = require("../models/prisma");

nftService.createNftRecord = (nftData) => prisma.nft.create({ data: nftData });
module.exports = nftService;
