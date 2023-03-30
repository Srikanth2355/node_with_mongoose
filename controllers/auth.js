const User = require('../models/user')
const bcrypt = require('bcryptjs')

exports.getLogin = (req,res,next)=>{
  let message = req.flash('error')
  if(message.length >0){
    message = message[0]
  }else{
    message = null
  }
  res.render('auth/login',{
      pagetitle:'login',
      path:'/login',
      isauthenticated: false,
      errormessage:message
  })
}
exports.postLogin = (req,res,next)=>{
  const email = req.body.email
  const password = req.body.password
    User.findOne({email:email})
    .then(user=>{
      if(!user){
        req.flash('error','Invalid Credentials')
        return res.redirect('/login')
      }
      bcrypt.compare(password,user.password)
      .then(result=>{
        // return boolean true or false
        if(result){
          req.session.isLoggedIn = true
          req.session.user = user
          return req.session.save((err)=>{
              console.log(err)
               res.redirect('/')
          })
        }else{
          req.flash('error','Invalid Credentials')

          return res.redirect('/login')
        }
      })
      .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
      console.log(err);
      res.redirect('/login');
    });
  };

  exports.getSignup = (req, res, next) => {
    let message = req.flash('error')
    if(message.length >0){
      message = message[0]
    }else{
      message = null
    }
    res.render('auth/signup', {
      path: '/signup',
      pagetitle: 'Signup',
      isauthenticated: false,
      errormessage:message
    });
  };

exports.postSignup = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  const confirmPassword = req.body.confirmPassword

  User.findOne({email:email})
  .then((doc)=>{
    if(doc){
      req.flash('error','Email Already Exists')
      res.redirect('/signup')
    }else{
      return bcrypt.hash(password,12)
      .then((hashedpassword)=>{
        const user = new User({
          email : email,
          password: hashedpassword,
          cart: {items:[]}
      
        })
        return user.save()
    
      })
      .then((result)=>{
        res.redirect('/login')
      })
    }
  })
  .catch(err=>console.log(err))
};
