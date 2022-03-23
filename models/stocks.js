require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, { useUnifiedTopology: true, useNewUrlParser: true });

const stockSchema = new mongoose.Schema({
  stock: {
    type: String,
    required: true,
    isUnique: true,
  },
  price: {
    type: Number,
    default: 0,
  },
  like: {
    type: Number,
    default: 0,
  },
  ip: [
    {
      type: String,
      default: "",
    },
  ],
});

const Stocks = mongoose.model("Stocks", stockSchema);

module.exports = Stocks;
