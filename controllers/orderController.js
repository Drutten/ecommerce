const {Order, CartItem} = require('../models/order');
const User = require("../models/user");
const {errorHandler} = require("../helperMethods/errorHandler");
require("dotenv").config();


exports.getOrders = (req, res) => {
    Order.find()
    .populate('user', '_id name address')
    .sort('-created')
    .exec((error, result) => {
        if (error) {
            return res.status(400).json({
                error: errorHandler(error)
            });
        }
        res.json(result);
    });
}


exports.createOrder = (req, res) => {
    req.body.order.user = req.profile;
    const order = new Order(req.body.order);
    order.save((err, result) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json(result);
    })
}