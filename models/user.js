const mongoose = require("mongoose");
const crypto = require("crypto");
const {v1: uuidv1} = require("uuid");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 60
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: 60
    },
    hashed_password: {
        type: String,
        required: true
    },
    salt: String,
    role: {
        type: Number,
        default: 0
    },
    history: {
        type: Array,
        default: []
    }
}, {timestamps: true});


userSchema.virtual("password")
.set(function(password) {
    this._password = password
    this.salt = uuidv1()
    this.hashed_password = this.encryptPassword(password)
})
.get(function() {
    return this._password;
})


userSchema.methods = {
    authenticate: function(password) {
        return this.encryptPassword(password) === this.hashed_password;
    },

    encryptPassword: function(password) {
        if(!password) return '';
        try {
            return crypto.createHmac("sha1", this.salt)
            .update(password)
            .digest("hex")
        } catch(err) {
            return '';
        }
    }
}

module.exports = mongoose.model("User", userSchema);