const product = require('../models/product')
const Product = require('../models/product')

exports.getaddproduct = (req,res,next)=>{
    res.render('admin/add_product',{pagetitle:"Add product",path:'admin/add-product',isauthenticated: req.session.isLoggedIn})
}

exports.postaddproduct = (req,res,next)=>{
    const title = req.body.title
    const imageurl = req.body.imageurl
    const price = req.body.price
    const description = req.body.description
    const userId = req.user._id
    const product = new Product({title:title,imageUrl:imageurl,price:price,description:description,userId:userId,})
    product.save()
    .then(result=>{
        res.redirect('/admin/products')
    })
    .catch(err=>console.log(err))
}

exports.getproducts = (req,res,next)=>{
    Product.find()
    // req.user.getProducts()
    .then(products=>{
        res.render('admin/products',{prods: products,pagetitle:'Admin Products',path:'admin/products',isauthenticated: req.session.isLoggedIn})
    })
    .catch(err=>console.log(err))
    
}

exports.editproduct = (req,res,next)=>{
    productid = req.body.id;
    // Product.findByPk(productid)
    Product.findById(productid)
    .then(product=>{
        res.render('admin/edit_product',{prod:product,pagetitle:'Edit Product',path:'admin/edit-product',isauthenticated: req.session.isLoggedIn})
    })
    .catch(err=>{
        console.log(err)
    })
}

exports.modifyproduct = (req,res,next)=>{
    const id = req.body.id
    const title = req.body.title
    const imageurl = req.body.imageurl
    const price = req.body.price
    const description = req.body.description

    product.findById(id).then(singleproduct=>{
        singleproduct.title = title,
        singleproduct.imageUrl = imageurl,
        singleproduct.description = description,
        singleproduct.price = price
        return singleproduct.save()
    })
    .then(result=>{
        console.log('updated')
        res.redirect('/products')
    })
    .catch(err=>console.log(err))
}

exports.deleteproduct = (req,res,next)=>{
    const id = req.body.id
    Product.findByIdAndRemove(id)
    .then(result=>{
        console.log('Deleted')
        res.redirect('/admin/products')
    })
    .catch(err=>console.log(err))
}