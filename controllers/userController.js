const User = require("../models/user");


exports.findUserById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "Användaren hittades inte"
            })
        }
        req.profile = user; // save user on req object
        next();
    });
};


exports.getUser = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
}


exports.updateUser = (req, res) => {
    User.findOneAndUpdate(
        {_id: req.profile._id},
        {$set: req.body},
        {new: true},
        (err, result) => {
            if (err) {
                return res.status(400).json({
                    error: "Profilen kunde inte uppdateras"
                });
            }
            result.hashed_password = undefined;
            result.salt = undefined;
            res.json(result);
        }
    )
}


exports.updateUserHistory = (req, res, next) => {
    const history = [];
    req.body.order.products.forEach(item => {
        history.push({
            _id: item._id,
            name: item.name,
            description: item.description,
            price: item.price,
            category: item.category,
            quantity: item.amount,
            transaction_id: req.body.order.transaction_id,
            amount: req.body.order.amount
        });
    });

    User.findOneAndUpdate(
        {_id: req.profile._id},
        {$push: {history: history}},
        {new: true},
        (error, result) => {
            if (error) {
                return res.status(400).json({
                    error: 'Historiken kunde inte uppdateras'
                });
            }
            next();
        }
    );
}