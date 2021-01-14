const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const cors = require("cors");
const helmet = require("helmet");
const authRoutes = require("./routes/authRoutes");
const { VerifyToken } = require("./middleware/auth");
const { getUserData } = require("./controllers/authController");

const app = express();

app.use(express.static("public"));

mongoose.connect(
  process.env.MONGODB_CONNECTION_STRING,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (err) => {
    if (err) throw err;
    console.log("MongoDB connection established");
  }
);

// middlewares
// Reference : https://expressjs.com/en/advanced/best-practice-security.html
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());
app.use(helmet()); // Protects are app from web vulnerabilities

// set up routes
app.use("/api", authRoutes);
app.post("/api/getuserdata", VerifyToken, getUserData);

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`The server has started on port: ${PORT}`));
