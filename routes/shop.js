const express = require('express')
const path = require('path')
const router = express.Router()
const rootdir = require('../util/path');
const admindata = require('./admin')
const shopcontroller = require('../controllers/shop')
const auth = require('../middleware/auth')

router.get("/",shopcontroller.getindex)

router.get('/cart',auth,shopcontroller.getcart)

router.post('/cart',auth,shopcontroller.postcart)

router.get('/orders',auth,shopcontroller.getorders)

// router.get('/checkout',shopcontroller.getcheckout)

router.get('/products', shopcontroller.getproducts)

router.get('/products/:id', shopcontroller.getspecificproduct)

router.post('/delete-product',auth, shopcontroller.deleteproduct)

router.post('/create-order',auth, shopcontroller.postcreateorder)



module.exports = router