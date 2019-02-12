const Order = require("../models/orders");
const Product = require("../models/product");

const mongoose = require("mongoose");

exports.getAll = (req, res, next) => {
  Order
    .find()
    .select("-__v")
    .populate("product", "name")
    .then(orders => res.status(200).json({
      count: orders.length,
      orders: orders.map(order => ({
        _id: order._id,
        product: order.product,
        quantity: order.quantity,
        request: {
          type: "GET",
          url: `http://127.0.0.1:3000/orders/${order._id}`
        }
      })),
    }))
    .catch(error => res.status(500).json({ error }));
};

exports.getOne = (req, res, next) => {
  Order
    .findById(req.params.order)
    .select("-__v")
    .populate("product")
    .then(order => order
      ? res.status(200).json({
        order: order,
        request: {
          type: "GET",
          url: `http://127.0.0.1:3000/orders`,
        }
      })
      : res.status(404).message({ message: "Order not found" })
    );
};

exports.patch = (req, res, next) => {
  res.status(200).json({
    message: "Updated order!",
  });
};

exports.create = (req, res, next) => {
  Product
    .findById(req.body.product)
    .then(product => product
      ? new Order({
        _id: new mongoose.Types.ObjectId(),
        product: product._id,
        quantity: req.body.quantity,
      }).save()
      : res.status(404).json({ message: "Product not found" })
    )
    .then(order => res.status(201).json({
      message: "Order was created",
      request: {
        type: "GET",
        order: {
          _id: order._id,
          product: order.product,
          quantity: order.quantity,
        },
        url: `http://127.0.0.1:3000/orders/${order._id}`,
      }
    }))
    .catch(error => res.status(500).json({ error }));
};

exports.delete = (req, res, next) => {
  Order
    .remove({ _id: req.params.order })
    .then(order => {
      res.status(200).json({
        message: "Order deleted",
        request: {
          type: "POST",
          url: "http:127.0.0.1:3000/orders",
        }
      })
    })
    .catch(error => res.status(500).json({ error }))
  res.status(200).json({
    message: "Deleted order!"
  });
};