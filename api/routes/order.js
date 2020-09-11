const express = require('express');
const router = express.Router();

const mongoose = require('mongoose')
const Product = require('../models/product')
const Order = require('../models/order')

router.get("/", (req, res, next) => {
    Order.find()
        .select('product quantity _id')
        .populate('product', 'name')
        .exec()
        .then(result => {
            const response = {
                count: result.length,
                orders: result.map(doc => {
                    return {
                        id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: "http://localhost:3000/orders/" + doc._id
                        }
                    }
                })
            }
            console.log(response)
            res.status(200).json(response);
        })
        .catch(error => {
            res.status(500).json({ error });
        })

});

router.post("/", (req, res, next) => {
    Product.findById(req.body.productId)        //checking if the product id is correct
        .then(product => {
            if (!product)
                return res.status(404).json({ error: "Not a valid product Id" }) //if not send error msg
            else {                              //if correct, post the order 
                const order = new Order({
                    _id: new mongoose.Types.ObjectId(),
                    product: req.body.productId,
                    quantity: req.body.quantity,
                });
                return order.save()
                    .then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: "Successfully posted an order",
                            CreatedOrder: response = {
                                _id: result._id,
                                quantity: result.quantity,
                                product: result.productId,
                                request: {
                                    type: 'GET',
                                    url: "http://localhost:3000/orders/" + result._id
                                }
                            }
                        });
                    })
            }
        })
        .catch(error => {
            res.status(500).json({ error })
        })
});

router.get("/:id", (req, res, next) => {
    const id = req.params.id;
    Order.findById({ _id: id })
        .select("_id product quantity")
        .populate('product')
        .exec()
        .then(result => {
            if (result)
                res.status(200).json({
                    order: result,
                    request: {
                        type: 'GET',
                        url: "http://localhost:3000/orders/"
                    }
                })
            else
                res.status(404).json({ error: "No valid order found for this ID" })
        })
        .catch(error => {
            res.status(500).json({ error })
        })

});

router.delete("/:id", (req, res, next) => {
    const id = req.params.id;
    Order.remove({ _id: id })
        .exec()
        .then(result => {
            console.log(result)
            res.status(200).json({ message: "Product is Deleted" })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: err })
        })
});


module.exports = router;