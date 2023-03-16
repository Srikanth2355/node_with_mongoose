const express = require('express')
const bodyparser = require('body-parser')
const adminroutes = require('./routes/admin')
const shoproutes = require('./routes/shop')
const path = require('path') 
const errorpage = require('./controllers/404')
const user = require('./models/user')
const mongoose =require('mongoose')


const app = express()
app.use(bodyparser.urlencoded({ extended:true}))
app.use(express.static(path.join(__dirname,'public')))

app.use((req,res,next)=>{
    user.findById("64112e3267a59c1136e52388")
    .then(user1=>{
        req.user = user1
        next()
    })
    .catch(err=>console.log(err))
})



app.use('/admin',adminroutes)
app.use(shoproutes)

app.set('view engine','ejs')
app.set('views','views')

app.use(errorpage.pagenotfound)

mongoose.connect('mongodb+srv://gubbasrikanth2355:<PASSWORD>@nodejs-cluster.2oz3kso.mongodb.net/?retryWrites=true&w=majority')
.then((result)=>{
    user.findOne().then(singleuser=>{
        if(!singleuser){
            const User = new user(
                {
                    name:"Srikanth",
                    email:"sri@test.com",
                    cart:{items:[]}
                }
            )
            User.save()
        }
    })
    app.listen(3000)
})
