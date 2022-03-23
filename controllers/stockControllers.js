const axios = require("axios");
const Stocks = require("../models/stocks.js");

const setStock = async (stock, price, like, ip) => {
  const newStock = await Stocks.create({ stock, price, like: like === "true" ? 1 : 0, ip: like === "true" ? ip : "" });
  return newStock.data;
};

const getStock = async (stock, price, ip, like) => {
  try {
    const findStock = await Stocks.find({ stock });

    let newStock = {};
    if (findStock.length === 0 && price !== undefined) {
      newStock = await setStock(stock, price, like, ip);
    } else if (like === "true" && findStock[0].ip.indexOf(ip) === -1) {
      newStock = await Stocks.findOneAndUpdate({ stock }, { $push: { ip }, $inc: { like: 1 } }, { new: true });
    } else {
      newStock = findStock[0];
    }
    return newStock;
  } catch (error) {
    return false;
  }
};

const getPrice = async (stock) => {
  try {
    const stockApi = await axios.get(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stock}/quote`);
    const data = stockApi.data;
    return data.latestPrice;
  } catch (error) {
    return false;
  }
};

const handleTwoStocks = async (stock, ip, like) => {
  const price1 = await getPrice(stock[0]);
  const price2 = await getPrice(stock[1]);
  const stock1 = await getStock(stock[0], price1, ip, like);
  const stock2 = await getStock(stock[1], price2, ip, like);

  let newStock = {};
  if (!stock1 || !stock2) {
    newStock = {
      stockData: [
        { stock: stock[0], price: price1, rel_likes: 0 },
        { stock: stock[1], price: price2, rel_likes: 0 },
      ],
    };
  } else {
    let firstLike = stock1.like;
    let secondLike = stock2.like;

    if (firstLike > secondLike) {
      firstLike = firstLike - secondLike;
      secondLike = -firstLike;
    } else {
      secondLike = secondLike - firstLike;
      firstLike = -secondLike;
    }
    newStock = {
      stockData: [
        { stock: stock[0], price: price1, rel_likes: firstLike },
        { stock: stock[1], price: price2, rel_likes: secondLike },
      ],
    };
  }
  return newStock;
};

module.exports = {
  getStock,
  getPrice,
  handleTwoStocks,
};
