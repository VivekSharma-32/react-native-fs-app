const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const colors = require("colors");
const connectToDB = require("./config/db");

// DOTENV
dotenv.config();

// Mongo DB Connection
connectToDB();

// rest object
const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/v1/auth", require("./routes/userRoutes"));
app.use("/api/v1/posts", require("./routes/postRoutes"));

// PORT
const PORT = process.env.PORT || 8080;

// listen
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`.bgGreen.white);
});
