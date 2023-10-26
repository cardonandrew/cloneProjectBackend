const http = require("http");
require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const router = require("./api");
app.use("/api", router);

router.use((req, res, next) => {
  console.log("A request was made to /api");
  next();
});

router.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = 3000;
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is listening in port ${PORT}`);
});
