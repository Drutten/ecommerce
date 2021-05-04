const Category = require("../models/category");
const {errorHandler} = require("../helperMethods/errorHandler");
// const { findById } = require("../models/category");

exports.findCategoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, category) => {
        if (err || !category) {
            return res.status(404).json({
                error: "Kategorin hittades inte"
            });
        }
        req.category = category;
        next();
    })
}

exports.getCategory = (req, res) => {
    return res.json(req.category);
}

exports.getCategories = (req, res) => {
    Category.find().exec((err, result) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json(result);
    })
}

exports.createCategory = (req, res) => {
    const category = new Category(req.body);
    category.save((err, result) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({result})
    });
}

exports.updateCategory = (req, res) => {
    const category = req.category;
    category.name = req.body.name;
    category.save((err, result) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json(result);
    });
}

exports.deleteCategory = (req, res) => {
    const category = req.category;
    category.remove((err, result) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json({
            message: "Kategorin har tagits bort."
        });
    });
}
