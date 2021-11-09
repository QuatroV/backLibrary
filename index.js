require("dotenv").config();
const express = require("express");
const sequelize = require("./db");

const fileUpload = require("express-fileupload");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const router = require("./routes");
const models = require("./models/models");
const errorHandler = require("./middleware/ErrorHandlingMiddleware");

const PORT = process.env.PORT || 5000;

const app = express();
app.use(
  fileUpload({
    createParentPath: true,
  })
);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api", router);
app.use(morgan("dev"));

// Error handling, last middleware
app.use(errorHandler);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
