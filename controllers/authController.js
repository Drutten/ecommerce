const jwt = require("jsonwebtoken"); // to generate signed webtoken
const expressJwt = require("express-jwt"); // for authorization check
const User = require("../models/user");
const {errorHandler} = require("../helperMethods/errorHandler");


exports.signup = (req, res) => {
    const user = new User(req.body);
    user.save((err, user) => {
        if (err) {
            // do not save
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        user.salt = undefined;
        user.hashed_password = undefined;
        res.json({
            user
        });
    });
}

exports.signin = (req, res) => {
    // find user based on email
    const {email, password} = req.body;
    
    User.findOne({email}, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "Användaren hittades inte. Skapa ett konto för att logga in."
            })
        }
        // if user exists password must match
        if (!user.authenticate(password)) {
            // unauthorized 401
            return res.status(401).json({
                error: "Felaktiga inloggningsuppgifter."
            })
        }
        // generate token
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);
        // keep token in cookie
        res.cookie("token", token, {expire: new Date() + 9999});
        // return user and token to client
        const {_id, name, email, role} = user;
        return res.json({token, user: {_id, name, email, role}});
    });
}

exports.signout = (req, res) => {
    res.clearCookie("token");
    res.json({message: "Utloggad"});
}

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    userProperty: "auth"
});

exports.isAuth = (req, res, next) => {
    let isAuthenticated = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!isAuthenticated) {
        return res.status(403).json({
            error: "Åtkomst nekad"
        });
    }
    next();
}

exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        return res.status(403).json({
            error: "Åtkomst nekad"
        });
    }
    next();
}