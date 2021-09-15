const User = require("../models/user");



exports.findUserById = async (req, res, next, id) => {
    try {
        const user = await User.findById(id).exec();
        if (!user) {
            return res.status(404).json({
                error: "Användaren hittades inte"
            })
        }
        req.profile = user; // save user on req object
        next();
    } catch(err) {
        return res.status(400).json({
            error: "Användaren hittades inte"
        })
    } 
};



exports.getUser = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
}



exports.updateUser = async (req, res) => {
    const { name, password } = req.body;
    let user = null;

    try {
        user = await User.findOne({ _id: req.profile._id });
        if (!user) {
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
    } catch(err) {
        return res.status(500).json({
            error: "Internt serverfel"
        });
    }

    try {
        const updatedUser = await user.save();
        updatedUser.hashed_password = undefined;
        updatedUser.salt = undefined;
        res.json(updatedUser);
    } catch(err) {
        return res.status(400).json({
            error: "Profilen kunde inte uppdateras"
        });
    }
};



exports.updateUserHistory = async (req, res, next) => {
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
    try {
        await User.findOneAndUpdate(
            {_id: req.profile._id},
            {$push: {history: history}},
            {new: true}
        );
        console.log('Document updated');
        next();
    } catch (err) {
        return res.status(400).json({
            error: 'Historiken kunde inte uppdateras'
        });   
    }   
}