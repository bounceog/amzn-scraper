const mongoose = require('mongoose');
const Product = require('../schema/product');

class MongoHandler {
    constructor(url) {
        mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
    }

    update(id, price) {
        return new Promise((resolve, reject) => {
            Product.findByIdAndUpdate(id, { $push: { 'prices' : { date: new Date(), value: price} } }, { new: true }, (err, doc) => {
                if(err) reject(err);
                resolve(doc)
            })
        });
    }

    getAllProducts() {
        return new Promise((resolve, reject) => {
            Product.find({}, (err, docs) => {
                if(err) throw reject(err);
                if(docs.length < 1) reject('No Products.')
                resolve(docs);
            });
        });
    }
}

module.exports = MongoHandler;