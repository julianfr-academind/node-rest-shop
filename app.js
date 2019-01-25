const express = require("express");
const app = express();

app.use("/products", require("./api/routes/products"));
app.use("/orders", require("./api/routes/orders"));

module.exports = app;