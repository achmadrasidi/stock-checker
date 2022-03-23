"use strict";
const { getPrice, handleTwoStocks, getStock } = require("../controllers/stockControllers.js");

module.exports = function (app) {
  app.route("/api/stock-prices").get(async function (req, res) {
    const { stock, like } = req.query;
    const ip = req.ip;
    const price = await getPrice(stock);

    if (Array.isArray(stock)) {
      const stockData = await handleTwoStocks(stock, ip, like);
      res.json(stockData);
    } else if (!price) {
      res.json({ error: "external source error", likes: 0 });
      return;
    } else {
      const newStock = await getStock(stock, price, ip, like);
      let likes;
      if (!newStock && like === "true") {
        likes = 1;
      } else if (!newStock && like === "false") {
        likes = 0;
      } else {
        likes = newStock.like;
      }
      let obj = {
        stockData: {
          stock,
          price,
          likes,
        },
      };

      res.json(obj);
      return;
    }
  });
};
