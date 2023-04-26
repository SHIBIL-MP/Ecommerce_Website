const mongoose = require("mongoose");
const ObjectID = mongoose.Schema.Types.ObjectId;
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String
  },
  price: {
    type: Number
  },
  category: {
    type: ObjectID,
    ref: "Category",
  },
  description: {
    type: String
  },
  images:[{
    url:{
      type:String
    },
    filename:{
      type:String
    }
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
