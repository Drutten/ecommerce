const Category = require("../models/category");
const {errorHandler} = require("../helperMethods/errorHandler");



exports.findCategoryById = async (req, res, next, id) => {
    try {
        const category = await Category.findById(id).exec();
        if (!category) {
            return res.status(404).json({
                error: "Kategorin hittades inte"
            });
        }
        req.category = category;
        next();
    } catch(err) {
        return res.status(400).json({
            error: "Kategorin hittades inte"
        });   
    }
}



exports.getCategory = (req, res) => {
    return res.json(req.category);
}



exports.getCategories = async (req, res) => {
    try {
        const result = await Category.find().exec();
        res.json(result);
    } catch(err) {
        return res.status(400).json({
            error: errorHandler(err)
        });   
    }
}



exports.createCategory = async (req, res) => {
    const category = new Category(req.body);
    try {
        const result = await category.save();
        res.json(result);
    } catch(err) {
        return res.status(400).json({
            error: errorHandler(err)
        });    
    }
}



exports.updateCategory = async (req, res) => {
    const category = req.category;
    category.name = req.body.name;
    try {
        const result = await category.save();
        res.json(result);
    } catch(err) {
        return res.status(400).json({
            error: errorHandler(err)
        });   
    }
}



exports.deleteCategory = async (req, res) => {
    let category = req.category;
    try {
        await category.remove();
        res.json({
            message: "Kategorin har tagits bort."
        });
    } catch(err) {
        return res.status(400).json({
            error: errorHandler(err)
        })    
    }
}
