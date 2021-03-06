const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
 
const CartItemSchema = new mongoose.Schema(
  {
    product: { 
        type: ObjectId, 
        ref: "Product" 
    },
    name: String,
    price: Number,
    amount: Number
  },
  { timestamps: true }
);
 
const CartItem = mongoose.model("CartItem", CartItemSchema);



const OrderSchema = new mongoose.Schema(
  {
    products: [CartItemSchema],
    transaction_id: {},
    amount: { type: Number },
    address: String,
    status: {
      type: String,
      default: "Ny",
      enum: ["Ny", "Behandlas", "Skickad", "Levererad", "Makulerad"]
    },
    updated: Date,
    user: { 
        type: ObjectId, 
        ref: "User" 
    }
  },
  { timestamps: true }
);
 
const Order = mongoose.model("Order", OrderSchema);
 
module.exports = { Order, CartItem };