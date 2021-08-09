const {Order, CartItem} = require('../models/order');
const {errorHandler} = require("../helperMethods/errorHandler");
require("dotenv").config();


exports.getOrders = (req, res) => {
    Order.find()
    .populate('user', '_id name address')
    .sort([['createdAt', 'desc']])
    .exec((error, result) => {
        if (error) {
            return res.status(400).json({
                error: errorHandler(error)
            });
        }
        res.json(result);
    });
}


exports.getStatusOptions = (req, res) => {
    res.json(Order.schema.path('status').enumValues);
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


exports.updateOrderStatus = (req, res) => {
    Order.updateOne(
        {_id: req.body.orderId}, 
        {$set: {status: req.body.status}}, (err, order) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(order);
        })
}


exports.findOrderById = (req, res, next, id) => {
    Order.findById(id)
    .populate('products.product', 'name price')
    .exec((err, order) => {
        if (err || !order) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        req.order = order;
        next();
    })
}


exports.getOrdersByUserId = (req, res) => {
    Order.find({user: req.profile._id})
    .populate('user', '_id name')
    .sort([['createdAt', 'desc']])
    .exec((err, orders) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(orders);
    });
}


exports.deleteOrder = (req, res) => {
    let order = req.order;
    order.remove((err, order) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: "Ordern har tagits bort"
        });
    })
}