const express = require("express");
const router = express.Router();
const {requireSignin, isAuth} = require("../controllers/authController");
const {findUserById} = require("../controllers/userController");
const {generateToken} = require("../controllers/braintreeController");

router.param("userId", findUserById);

router.get('/braintree/getToken/:userId', requireSignin, isAuth, generateToken);

module.exports = router;