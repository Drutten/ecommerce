const express = require("express");
const router = express.Router();
const {requireSignin, isAuth, isAdmin} = require("../controllers/authController");
const {findUserById, updateUserHistory} = require("../controllers/userController");
const {createOrder, getOrders} = require("../controllers/orderController");
const {updateSoldProductQuantity} = require("../controllers/productController");

router.param("userId", findUserById);

router.post(
    '/orders/create/:userId', 
    requireSignin, 
    isAuth, 
    updateUserHistory,
    updateSoldProductQuantity, 
    createOrder
);

router.get('/orders/all/:userId', requireSignin, isAuth, isAdmin, getOrders);

module.exports = router;