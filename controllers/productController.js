const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const Product = require("../models/product");
const {errorHandler} = require("../helperMethods/errorHandler");

const defaultLimit = 9;



exports.findProductById = async (req, res, next, id) => { // last parameter from route param
    try {
        const product = await Product.findById(id)
        .populate("category")
        .exec();
        if (!product) {
            return res.status(404).json({
                error: "Produkten hittades inte"   
            });
        }
        req.product = product;
        next(); 
    } catch(err) {
        return res.status(400).json({
            error: "Produkten hittades inte"   
        });    
    } 
}



exports.getProduct = (req, res) => {
    req.product.image = undefined;
    return res.json(req.product);
}



exports.getProducts = async (req, res) => {
    let order = req.query.order ? req.query.order : "desc";
    let sort = req.query.sort ? req.query.sort : "_id";
    let limit = req.query.limit ? +req.query.limit : defaultLimit;
    try {
        const result = await Product.find()
        .select("-image")
        .populate("category", "_id, name")
        .sort([[sort, order]])
        .limit(limit)
        .exec();
        res.json(result);   
    } catch(err) {
        return res.status(400).json({
            error: "Produkterna kunde inte hämtas"
        });
    }
}



exports.getProductsByCategory = async (req, res) => {
    let order = req.body.order ? req.body.order : "desc";
    let sort = req.body.sort ? req.body.sort : "_id";
    let limit = req.body.limit ? +req.body.limit : defaultLimit;
    try {
        const result = await Product.find({category: req.body.category})
        .select("-image")
        .populate("category")
        .sort([[sort, order]])
        .limit(limit)
        .exec();
        res.json(result);
    } catch(err) {
        return res.status(400).json({
            error: "Produkterna kunde inte hämtas"
        });
    }
}



exports.getSearch = async (req, res) => {
    let order = req.query.order ? req.query.order : "desc";
    let sort = req.query.sort ? req.query.sort : "_id";
    let limit = req.query.limit ? +req.query.limit : defaultLimit;
    let search = {};
    if (req.query.search) {
        search = {name: {$regex: req.query.search, $options: 'i'}};
    }
    try {
        const result = await Product.find(search)
        .select('-image')
        .sort([[sort, order]])
        .limit(limit)
        .populate("category");
        res.json(result);
    } catch(err) {
        return res.status(400).json({
            error: "Produkterna kunde inte hämtas"
        })
    }
}



exports.getProductsByIds = async (req, res) => {
    const ids = (req.body.ids) ? req.body.ids : [];
    try {
        const products = await Product.find({
            '_id': { $in: ids }
        }).select("-image").exec();
        res.json(products);
    } catch(err) {
        return res.status(400).json({
            error: "Produkterna kunde inte hämtas"
        });
    }
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
    form.parse(req, async (err, fields, files) => {
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
        try {
            const result = await product.save();
            res.json(result)
        } catch(err) {
            return res.status(400).json({
                error: errorHandler(err)
            })   
        }
    });
}



exports.deleteProduct = async (req, res) => {
    let product = req.product;
    try {
        await product.remove();
        res.json({
            message: "Produkten har tagits bort"
        });    
    } catch(err) {
        return res.status(400).json({
            error: errorHandler(err)
        });    
    }
}



exports.updateProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Bilden kunde inte laddas"
            });
        }
        // TODO Validation
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
        try {
            const result = await product.save();
            res.json(result)
        } catch(err) {
            return res.status(400).json({
                error: errorHandler(err)
            })   
        }
    });    
}



exports.updateSoldProductQuantity = async (req, res, next) => {
    const bulkOps = req.body.order.products.map(item => {
        return {
            updateOne: {
                filter: {_id: item._id},
                update: {$inc: {quantity: -item.amount, popularity: +item.amount}}
            }
        }
    });
    try {
        await Product.bulkWrite(bulkOps, {});
        next(); 
    } catch(err) {
        return res.status(400).json({
            error: 'Produkterna kunde inte uppdateras'
        });    
    }
}