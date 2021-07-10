const express = require("express");
const router = express.Router();
const {requireSignin, isAuth} = require("../controllers/authController");
const {findUserById, updateUserHistory} = require("../controllers/userController");
const {createOrder} = require("../controllers/orderController");
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

module.exports = router;