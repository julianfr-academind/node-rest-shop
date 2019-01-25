const express = require("express");
const app = express();

app.use(require("morgan")("tiny"));

app.use("/products", require("./api/routes/products"));
app.use("/orders", require("./api/routes/orders"));

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  })
});

module.exports = app;