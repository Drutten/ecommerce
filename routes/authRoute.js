const express = require("express");
const router = express.Router();

const {signup, signin, signout, requireSignin} = require("../controllers/authController");
const {validation, validate} = require("../validation/validation");

router.post(
    "/signup",
    validation,
    validate,
    signup
);

router.post(
    "/signin",
    signin
)

router.get(
    "/signout",
    signout
)

module.exports = router;