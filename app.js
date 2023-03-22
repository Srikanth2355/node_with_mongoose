const express = require('express')
const bodyparser = require('body-parser')
const adminroutes = require('./routes/admin')
const shoproutes = require('./routes/shop')
const authroutes = require('./routes/auth')
const session = require('express-session')

const path = require('path') 
const errorpage = require('./controllers/404')
const user = require('./models/user')
const mongoose =require('mongoose')
const MongoDBStore = require('connect-mongodb-session')(session);

const STRINGURL = 'mongodb+srv://gubbasrikanth2355:Vh2LLxtgdYSAxEbg@nodejs-cluster.2oz3kso.mongodb.net/?retryWrites=true&w=majority'

const store =  new MongoDBStore({
    uri: STRINGURL,
    collection: 'mySessions'
  });

const app = express()
app.use(bodyparser.urlencoded({ extended:true}))
app.use(express.static(path.join(__dirname,'public')))
app.use(session({secret:'my secret',resave:false,saveUninitialized:false,store:store}))

app.use('/admin',adminroutes)
app.use(shoproutes)
app.use(authroutes)


app.set('view engine','ejs')
app.set('views','views')

app.use(errorpage.pagenotfound)

mongoose.connect(STRINGURL)
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
