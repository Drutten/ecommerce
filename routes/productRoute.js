const express = require("express");
const router = express.Router();

const {
    createProduct, 
    deleteProduct, 
    updateProduct, 
    findProductById, 
    getProduct, 
    getProducts,
    getSearch, 
    getRelatedProducts,
    getProductCategories,
    getImage,
    getProductsByCategory,
    getProductsByIds
} = require("../controllers/productController");
const {findUserById} = require("../controllers/userController");
const {requireSignin, isAuth, isAdmin} = require("../controllers/authController");

router.param("userId", findUserById);
router.param("productId", findProductById);


router.get("/products/:productId", getProduct);

router.get("/products", getProducts);

router.get("/search", getSearch);

router.get("/products/image/:productId", getImage);

router.post("/filter", getProductsByCategory);

router.post("/filterids", getProductsByIds);


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