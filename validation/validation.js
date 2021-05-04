const {body, validationResult} = require("express-validator");

exports.validation = [
    body("name").trim().not().isEmpty().withMessage("Namn måste anges"),
    body("email").trim().isEmail().withMessage("Email måste vara en giltig emailadress")
    .normalizeEmail().toLowerCase(),
    body("password").trim().isLength({min: 6})
    .withMessage("Lösenordet måste innehålla minst 6 tecken")
    .matches(/\d/).withMessage("Lösenordet måste innehålla minst en siffra")
];

exports.validate = (req, res, next) => {
    // return if invalid
    const errors = validationResult(req).errors;
    if (errors.length) {
        const errorMessages = errors.map(error => error.msg);
        return res.status(400).json({error: errorMessages.join(". ")});
    }
    next();
}