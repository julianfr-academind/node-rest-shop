const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "Orders were fetched"
  })
});

router.get("/:order", (req, res, next) => {
  res.status(200).json({
    message: "Order details",
    order: req.params.order
  });
});

router.post("/", (req, res, next) => {
  res.status(201).json({
    message: "Order was created"
  })
});

router.patch("/:order", (req, res, next) => {
  res.status(200).json({
    message: "Updated order!"
  });
});

router.delete("/:order", (req, res, next) => {
  res.status(200).json({
    message: "Deleted order!"
  });
});

module.exports = router;