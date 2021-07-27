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
    console.log('UPDATE USER - req.user', req.user, 'UPDATE DATA', req.body);
    const { name, password } = req.body;
 
    User.findOne({ _id: req.profile._id }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "Profilen kunde inte hittas"
            });
        }
        if (!name) {
            return res.status(400).json({
                error: "Namn är obligatoriskt"
            });
        } else {
            user.name = name;
        }
 
        if (password) {
            if (password.length < 6) {
                return res.status(400).json({
                    error: "Lösenordet måste innehålla minst 6 tecken"
                });
            } else {
                user.password = password;
            }
        }
 
        user.save((err, updatedUser) => {
            if (err) {
                console.log("USER UPDATE ERROR", err);
                return res.status(400).json({
                    error: "Profilen kunde inte uppdateras"
                });
            }
            updatedUser.hashed_password = undefined;
            updatedUser.salt = undefined;
            res.json(updatedUser);
        });
    });
};


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