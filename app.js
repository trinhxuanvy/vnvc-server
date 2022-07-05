const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const route = require("./routes");

dotenv.config();

const server = express();

server.use(express.urlencoded({ extended: true, limit: "50mb" }));
server.use(express.json({ limit: "50mb" }));
server.use(cors());
route(server);

const port = process.env.PORT || 3000;

mongoose
  .connect(process.env.CONNECT_DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch(() => {
    console.log("Can't connect to database");
  });

server.listen(port, () => {
  console.log("Listening at port " + port);
});
