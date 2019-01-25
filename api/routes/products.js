const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "Handling GET request to /products"
  })
});

router.get("/:product", (req, res, next) => {
  const product = req.params.product;
  if (product === "special") {
    res.status(200).json({
      message: "You discovered the special product",
      product
    });
  } else {
    res.status(200).json({ product });
  };
});

router.post("/", (req, res, next) => {
  res.status(201).json({
    message: "Product was created"
  })
});

router.patch("/:product", (req, res, next) => {
  res.status(200).json({
    message: "Updated product!"
  });
});

router.delete("/:product", (req, res, next) => {
  res.status(200).json({
    message: "Deleted product!"
  });
});

module.exports = router;