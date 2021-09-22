const {Order, CartItem} = require('../models/order');
const {errorHandler} = require("../helperMethods/errorHandler");
require("dotenv").config();



exports.getOrders = async (req, res) => {
    try {
        const result = await Order.find()
        .populate('user', '_id name address')
        .sort([['createdAt', 'desc']])
        .exec();
        res.json(result);
    } catch(err) {
        return res.status(400).json({
            error: errorHandler(err)
        });
    }
}


exports.getStatusOptions = (req, res) => {
    res.json(Order.schema.path('status').enumValues);
}



exports.createOrder = async (req, res) => {
    req.body.order.user = req.profile;
    const order = new Order(req.body.order);
    try {
        const result = await order.save();
        res.json(result);
    } catch(err) {
        return res.status(400).json({
            error: errorHandler(err)
        });    
    }
}



exports.updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.updateOne(
            {_id: req.body.orderId}, 
            {$set: {status: req.body.status}}
        );
        res.json(order);
    } catch(err) {
        return res.status(400).json({
            error: errorHandler(err)
        });
    }
}



exports.findOrderById = async (req, res, next, id) => {
    try {
        const order = await Order.findById(id)
        .populate('products.product', 'name price')
        .exec();
        if (!order) {
            return res.status(404).json({
                error: "Ordern hittades inte"   
            });    
        }
        req.order = order;
        next();
    } catch(err) {
        return res.status(400).json({
            error: "Ordern hittades inte"
        });    
    }
}



exports.getOrdersByUserId = async (req, res) => {
    try {
        const result = await Order.find({user: req.profile._id})
        .populate('user', '_id name')
        .sort([['createdAt', 'desc']])
        .exec();
        res.json(result);
    } catch(err) {
        return res.status(400).json({
            error: errorHandler(err)
        });
    }
}



exports.deleteOrder = async (req, res) => {
    let order = req.order;
    try {
        await order.remove();
        res.json({
            message: "Ordern har tagits bort"
        });
    } catch(err) {
        return res.status(400).json({
            error: errorHandler(err)
        });
    }
}