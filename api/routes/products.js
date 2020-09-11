const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const Product = require('../models/product')

router.get("/", (req, res, next) => {
    Product.find()
        .select("name price _id")
        .exec()
        .then(result => {
            const response = {
                count: result.length,
                products: result.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: "http://localhost:3000/products/" + doc._id
                        }
                    }
                })
            }
            console.log(response)
            res.status(200).json(response)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err })
        })
});

router.post("/", (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
    })
    product.save()
        .then(result => {
            console.log(result)
            res.status(201).json({
                message: "Successfully Created a product",
                CreatedProduct: response = {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: "http://localhost:3000/products/" + result._id
                    }
                }
            });
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err })
        })

});

router.get("/:id", (req, res, next) => {
    const id = req.params.id;
    Product.findById(id)
        .select("name price _id")
        .exec()
        .then(result => {
            if (result) {
                console.log(result)
                res.status(200).json({
                    product:result,
                    request: {
                        type: 'GET',
                        url: "http://localhost:3000/products/"
                    }
                })
            } else {
                res.status(404).json({ message: "No valid product found for this ID" })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err })
        })
});

router.patch("/:id", (req, res, next) => {
    const id = req.params.id;
    const updateOps = {}
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value
    }

    Product.updateOne({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            //console.log(result)
            res.status(200).json({
                message: "Product is updated",
                request: {
                    type: "GET",
                    url: "http://localhost:3000/products/" + id
                }
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err })
        })
});

router.delete("/:id", (req, res, next) => {
    const id = req.params.id;
    Product.remove({ _id: id })
        .exec()
        .then(result => {
            console.log(result)
            res.status(200).json({ message: "Product Deleted" })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err })
        })
});


module.exports = router;