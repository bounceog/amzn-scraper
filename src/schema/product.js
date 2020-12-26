const mongoose = require('mongoose'); 
  
const ProductSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    url: String, 
    name: String, 
    prices: Array 
}); 
  
module.exports = mongoose.model('Product', ProductSchema, 'Product'); 
