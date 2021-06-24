const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const Product = require("../models/product");
const {errorHandler} = require("../helperMethods/errorHandler");

const defaultLimit = 9;


exports.findProductById = (req, res, next, id) => { // last parameter from route param
    Product.findById(id)
    .populate("category")
    .exec((err, product) => {
        if (err || !product) {
            return res.status(404).json({
                error: "Produkten hittades inte"   
            });
        }
        req.product = product;
        next();
    });
}


exports.getProduct = (req, res) => {
    req.product.image = undefined;
    return res.json(req.product);
}


exports.getProducts = (req, res) => {
    let order = req.query.order ? req.query.order : "asc";
    let sort = req.query.sort ? req.query.sort : "_id";
    let limit = req.query.limit ? +req.query.limit : defaultLimit;

    Product.find()
    .select("-image")
    .populate("category", "_id, name")
    .sort([[sort, order]])
    .limit(limit)
    .exec((err, result) => {
        if (err) {
            return res.status(400).json({
                error: "Produkterna kunde inte hämtas"
            });
        }
        res.json(result);
    });
}


exports.getSearch = (req, res) => {
    let order = req.query.order ? req.query.order : "asc";
    let sort = req.query.sort ? req.query.sort : "_id";
    let limit = req.query.limit ? +req.query.limit : defaultLimit;
    let search = {};
    if (req.query.search) {
        search = {name: {$regex: req.query.search, $options: 'i'}};
    }
    // else if (req.query.category) {}
    // find the products based on query object
    Product.find(search, (err, products) => {
        if (err) {
            return res.status(400).json({
                error: "Produkterna kunde inte hämtas"
            })
        }
        res.json(products);
    })
    .select('-image')
    .sort([[sort, order]])
    .limit(limit)
    .populate("category");
}


exports.getRelatedProducts = (req, res) => {
    let limit = req.query.limit ? +req.query.limit : defaultLimit;
    
    Product.find({_id: {$ne: req.product}, category: req.product.category})
    .select("-image")
    .limit(limit)
    .populate("category", "_id, name")
    .exec((err, result) => {
        if (err) {
            return res.status(400).json({
                error: "Produkterna kunde inte hämtas"
            });
        }
        res.json(result);
    });
}


exports.getProductCategories = (req, res) => {
    Product.distinct("category", {}, (err, result) => {
        if (err) {
            return res.status(400).json({
                error: "Kategorierna kunde inte hämtas"
            });
        }
        res.json(result);    
    })
}


exports.getProductsByFilter = (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sort = req.body.sort ? req.body.sort : "_id";
    let limit = req.body.limit ? +req.body.limit : defaultLimit;
    let skip = +req.body.skip;
    let findArgs = {};

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    Product.find(findArgs)
    .select("-image")
    .populate("category")
    .sort([[sort, order]])
    .skip(skip)
    .limit(limit)
    .exec((err, result) => {
        if (err) {
            return res.status(400).json({
                error: "Produkterna kunde inte hämtas"
            });
        }
        res.json({
            size: result.length, // num products
            result
        });
    });
}


exports.getImage = (req, res, next) => {
    if (req.product.image.data) {
        res.set('Content-Type', req.product.image.contentType);
        return res.send(req.product.image.data);
    }
    next();
}


exports.createProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Bilden kunde inte laddas"
            });
        }
        // validate
        const {name, description, price, category, quantity, shipping} = fields;
        if (!name || !description || !price || !category || !quantity || ! shipping) {
            return res.status(400).json({
                error: "Det saknas uppgifter"
            });
        }
        let product = new Product(fields);

        if (files.image) {
            if (files.image.size > 200000) {
                return res.status(400).json({
                    error: "Bilden är för stor. Ska inte vara större än 200 kb."
                });
            }
            product.image.data = fs.readFileSync(files.image.path);
            product.image.contentType = files.image.type;
        }

        product.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(result)
        })
    });
}


exports.deleteProduct = (req, res) => {
    let product = req.product;
    product.remove((err, product) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: "Produkten har tagits bort"
        });
    })
}


exports.updateProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Bilden kunde inte laddas"
            });
        }
        // validate
        const {name, description, price, category, quantity, shipping} = fields;
        if (!name || !description || !price || !category || !quantity || ! shipping) {
            return res.status(400).json({
                error: "Det saknas uppgifter"
            });
        }
        let product = req.product;
        product = _.extend(product, fields);

        if (files.image) {
            if (files.image.size > 200000) {
                return res.status(400).json({
                    error: "Bilden är för stor. Ska inte vara större än 200 kb."
                });
            }
            product.image.data = fs.readFileSync(files.image.path);
            product.image.contentType = files.image.type;
        }

        product.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(result)
        })
    });    
}