const express = require('express')
const path = require('path')
const router = express.Router()
const rootdir = require('../util/path');
const admindata = require('./admin')
const shopcontroller = require('../controllers/shop')

router.get("/",shopcontroller.getindex)

router.get('/cart',shopcontroller.getcart)

router.post('/cart',shopcontroller.postcart)

router.get('/orders',shopcontroller.getorders)

// router.get('/checkout',shopcontroller.getcheckout)

router.get('/products', shopcontroller.getproducts)

router.get('/products/:id', shopcontroller.getspecificproduct)

router.post('/delete-product', shopcontroller.deleteproduct)

router.post('/create-order', shopcontroller.postcreateorder)



module.exports = router