const express = require("express");
const router = express.Router();
const {requireSignin, isAuth, isAdmin} = require("../controllers/authController");
const {findUserById, updateUserHistory} = require("../controllers/userController");
const {
    findOrderById, 
    createOrder, 
    updateOrderStatus, 
    getOrders,
    deleteOrder, 
    getStatusOptions,
    getOrdersByUserId 
} = require("../controllers/orderController");
const {updateSoldProductQuantity} = require("../controllers/productController");

router.param("userId", findUserById);

router.param('orderId', findOrderById);

router.post(
    '/orders/create/:userId', 
    requireSignin, 
    isAuth, 
    updateUserHistory,
    updateSoldProductQuantity, 
    createOrder
);

router.put(
    '/orders/:orderId/status/:userId', 
    requireSignin, 
    isAuth, 
    isAdmin, 
    updateOrderStatus
);

router.get('/orders/all/:userId', requireSignin, isAuth, isAdmin, getOrders);

router.get('/orders/user/:userId', requireSignin, isAuth, getOrdersByUserId);

router.get(
    '/orders/status-options/:userId', 
    requireSignin, 
    isAuth, 
    isAdmin, 
    getStatusOptions
);

router.delete(
    "/orders/:orderId/:userId", 
    requireSignin,
    isAuth,
    isAdmin,
    deleteOrder
);

module.exports = router;