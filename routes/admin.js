const express = require('express')
const path = require('path')
const router = express.Router()
const rootdir = require('../util/path');
const admincontroller = require('../controllers/admin')

router.get('/add-product',admincontroller.getaddproduct)

router.get('/products', admincontroller.getproducts)

router.post('/edit-product', admincontroller.editproduct)

router.post('/modify-product',admincontroller.modifyproduct)

router.post('/add-product',admincontroller.postaddproduct)

router.post('/delete-product', admincontroller.deleteproduct)


module.exports = router;