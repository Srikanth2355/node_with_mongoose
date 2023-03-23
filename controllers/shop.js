const Product = require('../models/product');
const Order = require('../models/order')


exports.getproducts = (req,res,next)=>{
    Product.find()
    .then((products)=>{
        // console.log('products returned',products)
        res.render('shop/products_list',
        {prods: products,pagetitle:'Products',path:'/products',isauthenticated: req.session.isLoggedIn})
    })
    .catch(err=>console.log(err))
}

exports.getspecificproduct = (req,res,next)=>{
    let productid = req.params.id;

    Product.findById(productid)
    .then((product)=>{
        res.render('shop/product_details',
        {prod: product,pagetitle:'Specific product',path:'/products',isauthenticated: req.session.isLoggedIn})
    })
    .catch(err=>console.log(err))
}

exports.getindex = (req,res,next)=>{
    Product.find()
    .then((products)=>{
        res.render('shop/index',
        {prods: products,pagetitle:'Index',path:'/',isauthenticated: req.session.isLoggedIn})
    })
    .catch(err=>console.log(err))
}

exports.getcart = (req,res,next)=>{
    req.user.populate('cart.items.productId')
    .then(user=>{
        const products = user.cart.items
            res.render('shop/cart',{
                pagetitle:'cart',
                path:'/cart',
                products:products,
                isauthenticated: req.session.isLoggedIn
            })
        })
    .catch(err=>console.log(err))
    
}

exports.postcart = (req,res,next)=>{
    const prodid = req.body.productid
    Product.findById(prodid)
    .then(product=>{
        return req.user.addToCart(product)
    })
    .then(result=>{
        console.log(result)
        res.redirect('/cart')
    })
    .catch(err=>console.log(err))
}



exports.getcheckout = (req,res,next)=>{
    res.render('shop/checkout',{
        pagetitle:'checkout',
        path:'/checkout'
    })
}

exports.deleteproduct = (req,res,next)=>{
    const prodid = req.body.id
    req.user.removeFromCart(prodid)
    .then(()=>{
        res.redirect('/cart')
    })
    .catch(err=>console.log(err))
}

exports.postcreateorder = (req,res,next)=>{
    req.user.populate('cart.items.productId')
    .then(user=>{
        const products=user.cart.items.map(i=>{
            return {quantity:i.quantity,product:{...i.productId._doc}}
        })
        console.log("prod",products)
        const order = new Order({
            user:{
                name:req.user.name,
                userId:req.user
            },
            products:products
        })
        return order.save()
    })
    .then(result=>{
        return req.user.clearCart()
        
    })
    .then(result=>{
        res.redirect('/orders')

    })
    .catch(err=>console.log(err))

}

exports.getorders = (req,res,next)=>{
    Order.find({'user.userId':req.user._id})
    .then(orders=>{
        console.log("orders",orders.products)
        res.render('shop/orders',{
            pagetitle:'orders',
            path:'/orders',
            orders:orders,
            isauthenticated: req.session.isLoggedIn
        })
    })

    .catch(err=>{
        console.log(err)
    })
}