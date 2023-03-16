const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    cart:{
        items:[{productId:{type:Schema.Types.ObjectId,ref:'Product',required:true},quantity:{type:Number,required:true}}]
    }
})

userSchema.methods.addToCart = function(product){
    const productindex = this.cart.items.findIndex(item=>{
        return item.productId.toString() === product._id.toString()
    })
    let newquantity = 1
    let updatedcartitems = this.cart.items
    if(productindex >= 0){
        newquantity = updatedcartitems[productindex].quantity + 1
        updatedcartitems[productindex].quantity = newquantity
    }else{
        updatedcartitems.push({productId:product._id,quantity:1})
    }

    const updatedcart = {items:updatedcartitems}
    this.cart = updatedcart
    return this.save()
}

userSchema.methods.removeFromCart = function(prodId){
    const updatedcartitems = this.cart.items.filter(item=>{
        return item.productId.toString() !== prodId.toString()
    })
    this.cart.items = updatedcartitems
    return this.save()
}

userSchema.methods.clearCart = function(){
    this.cart = {items:[]}
    return this.save()
}



module.exports = mongoose.model('User',userSchema)