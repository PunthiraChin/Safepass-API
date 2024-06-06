require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server Running on Port ${PORT}`));
