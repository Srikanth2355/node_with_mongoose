const express = require('express')
const path = require('path')
const router = express.Router()
const rootdir = require('../util/path');
const admincontroller = require('../controllers/admin')
const auth = require('../middleware/auth')

router.get('/add-product',auth,admincontroller.getaddproduct)

router.get('/products', auth, admincontroller.getproducts)

router.post('/edit-product',auth, admincontroller.editproduct)

router.post('/modify-product',auth,admincontroller.modifyproduct)

router.post('/add-product',auth,admincontroller.postaddproduct)

router.post('/delete-product',auth, admincontroller.deleteproduct)


module.exports = router;