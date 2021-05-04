const express = require("express");
const router = express.Router();

const {createCategory, getCategory, getCategories, updateCategory, deleteCategory, findCategoryById} = require("../controllers/categoryController");
const {findUserById} = require("../controllers/userController");
const {requireSignin, isAuth, isAdmin} = require("../controllers/authController");

router.param("userId", findUserById);
router.param("categoryId", findCategoryById);


router.get("/categories/:categoryId", getCategory);

router.get("/categories", getCategories);

router.post(
    "/categories/create/:userId",
    requireSignin,
    isAuth,
    isAdmin,
    createCategory
);

router.put(
    "/categories/:categoryId/:userId", 
    requireSignin,
    isAuth,
    isAdmin,
    updateCategory
);

router.delete(
    "/categories/:categoryId/:userId", 
    requireSignin,
    isAuth,
    isAdmin,
    deleteCategory
);

module.exports = router;