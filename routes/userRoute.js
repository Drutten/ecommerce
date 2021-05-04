const express = require("express");
const router = express.Router();

const {findUserById, getUser, updateUser} = require("../controllers/userController");
const {requireSignin, isAuth, isAdmin} = require("../controllers/authController");


router.param("userId", findUserById);

router.get("/secret/:userId", requireSignin, isAuth, (req, res) => {
    res.json({
        user: req.profile
    });
});

router.get("/users/:userId", requireSignin, isAuth, getUser);

router.put("/users/:userId", requireSignin, isAuth, updateUser);

module.exports = router;