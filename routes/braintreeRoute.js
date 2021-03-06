const express = require("express");
const router = express.Router();
const {requireSignin, isAuth} = require("../controllers/authController");
const {findUserById} = require("../controllers/userController");
const {generateToken, processPayment} = require("../controllers/braintreeController");

router.param("userId", findUserById);

router.get('/braintree/getToken/:userId', requireSignin, isAuth, generateToken);

router.post('/braintree/payment/:userId', requireSignin, isAuth, processPayment);

module.exports = router;