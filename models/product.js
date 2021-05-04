const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 60
    },
    description: {
        type: String,
        trim: true,
        required: true,
        maxlength: 2000
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: ObjectId,
        ref: "Category",
        required: true
    },
    quantity: {
        type: Number
    },
    popularity: {
        type: Number,
        default: 0
    },
    image: {
        data: Buffer,
        contentType: String
    },
    shipping: {
        type: Boolean,
        required: false
    }
    
}, {timestamps: true});


module.exports = mongoose.model("Product", productSchema);