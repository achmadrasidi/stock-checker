const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

const { getPrice, getStock, handleTwoStocks } = require("../controllers/stockControllers.js");

chai.use(chaiHttp);
let stock;
let like;
suite("Functional Tests", function () {
  suite("Route Tests", () => {
    suite("GET /api/stock-prices", () => {
      test("Viewing one stock", (done) => {
        stock = "GOOG";
        like = "false";
        chai
          .request(server)
          .get("/api/stock-prices")
          .query({ stock, like })
          .end(async (err, res) => {
            if (err) {
              console.error(err);
            } else {
              const ip = "192.168.1.1";
              const price = await getPrice(stock);
              const likes = await getStock(stock, price, ip, like);

              assert.equal(res.status, 200);
              assert.isObject(res.body, "Body must contain Object");
              assert.deepEqual(res.body.stockData, { likes: likes.like, price, stock });
              done();
            }
          });
      });
      test("Viewing one stock and liking it", (done) => {
        stock = "GOOG";
        like = "true";
        chai
          .request(server)
          .get("/api/stock-prices")
          .query({ stock, like })
          .end(async (err, res) => {
            if (err) {
              console.error(err);
            } else {
              const ip = "192.168.1.5";

              const price = await getPrice(stock);
              const likes = await getStock(stock, price, ip, like);

              assert.equal(res.status, 200);
              assert.deepEqual(res.body.stockData, { likes: likes.like, price, stock });
              done();
            }
          });
      });
      test("Viewing the same stock and liking it again", (done) => {
        stock = "GOOG";
        like = "true";
        chai
          .request(server)
          .get("/api/stock-prices")
          .query({ stock, like })
          .end(async (err, res) => {
            if (err) {
              console.error(err);
            } else {
              const ip = "192.168.1.5";

              const price = await getPrice(stock);
              const likes = await getStock(stock, price, ip, like);

              assert.equal(res.status, 200);
              assert.isNumber(res.body.stockData.price, "Price should be a number");
              assert.isNumber(res.body.stockData.likes, "Likes should be a number");
              assert.deepEqual(res.body.stockData, { likes: likes.like, price, stock });
              done();
            }
          });
      });
      test("Viewing two stocks", (done) => {
        stock = ["GOOG", "MSFT"];
        like = "false";
        chai
          .request(server)
          .get("/api/stock-prices")
          .query({ stock, like })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body.stockData, "stockData should be an Array");
            assert.equal(res.body.stockData[0].stock, stock[0]);
            assert.equal(res.body.stockData[1].stock, stock[1]);
            assert.isNumber(res.body.stockData[0].rel_likes, "stockData rel_likes should be a Number");
            assert.isNumber(res.body.stockData[0].price, "stockData price should be a Number");
            done();
          });
      });
      test("Viewing two stocks and liking them", (done) => {
        stock = ["GOOGL", "AAPL"];
        like = "true";
        chai
          .request(server)
          .get("/api/stock-prices")
          .query({ stock, like })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isArray(res.body.stockData, "stockData should be an Array");
            assert.equal(res.body.stockData[0].stock, stock[0]);
            assert.isNumber(res.body.stockData[0].rel_likes, "stockData rel_likes should be a Number");
            assert.isNumber(res.body.stockData[0].price, "stockData price should be a Number");
            done();
          });
      });
    });
  });
});
