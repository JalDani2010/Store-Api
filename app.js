require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const notFoundMiddleware = require("./middleware/not-found.js");
const errorMiddleware = require("./middleware/error-handler.js");
const productsRouter = require("./routes/products.js");

app.use(express.json());

// rootes
app.get("/", (req, res) => {
  res.send("<h1>Store API</h1><a href='/api/v1/products'>products</a>");
});

app.use("/api/v1/products", productsRouter);

app.use(notFoundMiddleware); // 404 middleware
app.use(errorMiddleware); // error middleware

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    const connect = require("./db/connect.js");
    await connect(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.error(error);
  }
};

start();
