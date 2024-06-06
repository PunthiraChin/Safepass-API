const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const password = bcrypt.hashSync("123456");
const startDateTime = new Date("2024-06-10 18:00:00").toISOString();
const endDateTime = new Date("2024-06-10 24:00:00").toISOString();

const userData = [
  { email: "a@gmail.com", password: password, role: "ADMIN" },
  { email: "b@gmail.com", password: password, role: "CUSTOMER" },
  {
    email: "c@gmail.com",
    password: password,
    googleId: "123456",
    role: "CUSTOMER",
  },
];
const eventData = {
  name: "EVENT1",
  details: "The biggest concert to celebrate 10 year anniversary of our band",
  organizer: "BigRoom",
  avenue: "Impact Arena, Muang Thong Thani",
  coverImage:
    "https://aqua-mobile-bandicoot-440.mypinata.cloud/ipfs/Qmd1CgUKiTVKwKt28TWxtSnc1aBjsYn9kVTQQfZdb4UiQB",
  profileImage:
    "https://aqua-mobile-bandicoot-440.mypinata.cloud/ipfs/Qmd1CgUKiTVKwKt28TWxtSnc1aBjsYn9kVTQQfZdb4UiQB",
  seatMapImage:
    "https://aqua-mobile-bandicoot-440.mypinata.cloud/ipfs/Qmd1CgUKiTVKwKt28TWxtSnc1aBjsYn9kVTQQfZdb4UiQB",
  contractAddress: "0x118dfa1E8057C16E5E3e50961b5758134ba40367",
  startDateTime: startDateTime,
  endDateTime: endDateTime,
  ticketTypes: {
    create: [
      {
        name: "ZoneA",
        details: "VIP Zone. Only 100 seats.",
        maximumSeat: 100,
        remainingSeat: 100,
        ticketImage:
          "https://aqua-mobile-bandicoot-440.mypinata.cloud/ipfs/Qmd1CgUKiTVKwKt28TWxtSnc1aBjsYn9kVTQQfZdb4UiQB",
        price: 5000.0,
      },
      {
        name: "ZoneB",
        details: "Special Zone. 500 seats.",
        maximumSeat: 500,
        remainingSeat: 500,
        ticketImage:
          "https://aqua-mobile-bandicoot-440.mypinata.cloud/ipfs/Qmd1CgUKiTVKwKt28TWxtSnc1aBjsYn9kVTQQfZdb4UiQB",
        price: 3000.0,
      },
      {
        name: "ZoneC",
        details: "For everyone. 1000 seats",
        maximumSeat: 1000,
        remainingSeat: 1000,
        ticketImage:
          "https://aqua-mobile-bandicoot-440.mypinata.cloud/ipfs/Qmd1CgUKiTVKwKt28TWxtSnc1aBjsYn9kVTQQfZdb4UiQB",
        price: 1500.0,
      },
    ],
  },
};

const run = async () => {
  await prisma.user.createMany({ data: userData });
  await prisma.event.create({ data: eventData });
};

run();
