const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const {
  generateEsewaURL,
  handleEsewaSuccess,
  handleEsewaFailure,
} = require("./src/controllers/esewaController");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", require("./src/routes/authRoutes"));

app.get("/", (req, res) => {
  res.send("Welcome to Annapur Backend!");
});

app.post("/api/payment/esewa/initiate", generateEsewaURL);
app.get("/api/payment/esewa/success", handleEsewaSuccess);
app.get("/api/payment/esewa/failure", handleEsewaFailure);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`eSewa backend running on http://localhost:${PORT}`);
});

module.exports = app;
