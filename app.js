const mongoose = require("mongoose");
const app = require("express")();
app.use("/uploads", require("express").static("./uploads"));

mongoose.connect(`mongodb+srv://admin:${process.env.mongodbPassword}@julianfr-academind-node-shop-large.mongodb.net/test?retryWrites=true`, { useNewUrlParser: true });

app.use(require("morgan")("dev"));
app.use(require("body-parser").urlencoded({ extended: false }));
app.use(require("body-parser").json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow_Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use("/products", require("./api/routes/products"));
app.use("/orders", require("./api/routes/orders"));
app.use("/users", require("./api/routes/user"));

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