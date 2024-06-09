require("dotenv").config();
const express = require("express");
const cors = require("cors");
const homepageRouter = require("./routes/homepage-route");
const eventRouter = require("./routes/event-route");
const adminRouter = require("./routes/admin-route");
const authRouter = require("./routes/auth-route");
const notFoundMiddleware = require("./middleware/not-found");
const errorMiddleware = require("./middleware/error");
const userRouter = require("./routes/user-route");

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/homepage", homepageRouter);
app.use("/events", eventRouter);
app.use("/admin", adminRouter);
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use(notFoundMiddleware);
app.use(errorMiddleware);
let PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server Running on Port ${PORT}`));
