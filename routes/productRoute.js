const express = require("express");
const router = express.Router();

const {
    createProduct, 
    deleteProduct, 
    updateProduct, 
    findProductById, 
    getProduct, 
    getProducts, 
    getRelatedProducts,
    getProductCategories,
    getProductsByFilter,
    getImage
} = require("../controllers/productController");
const {findUserById} = require("../controllers/userController");
const {requireSignin, isAuth, isAdmin} = require("../controllers/authController");

router.param("userId", findUserById);
router.param("productId", findProductById);


router.get("/products/:productId", getProduct);

router.get("/products", getProducts);

router.get("/products/related/:productId", getRelatedProducts);

router.get("/products/distinct/categories", getProductCategories);

router.get("/products/image/:productId", getImage);

router.post("/products/filter", getProductsByFilter);// fix. filter not search

router.post(
    "/products/create/:userId",
    requireSignin,
    isAuth,
    isAdmin,
    createProduct
);

router.delete(
    "/products/:productId/:userId", 
    requireSignin,
    isAuth,
    isAdmin,
    deleteProduct
);

router.put(
    "/products/:productId/:userId", 
    requireSignin,
    isAuth,
    isAdmin,
    updateProduct
);

module.exports = router;