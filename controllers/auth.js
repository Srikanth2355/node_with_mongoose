const User = require('../models/user')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const crypto = require('crypto')

const { validationResult  } = require('express-validator')
// const transporter = nodemailer.createTransport(sendgridTransport())
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
      errormessage:message,
      oldInputvalues:{
        email:"",
        password:"",
      }
      
  })
}
exports.postLogin = (req,res,next)=>{
  const email = req.body.email
  const password = req.body.password
  const error_result = validationResult(req)
  console.log(error_result.array())
  if(!error_result.isEmpty()){
    let errors = error_result.array()
    return res.status(422).render('auth/login', {
      path: '/login',
      pagetitle: 'Login',
      errormessage:errors[0]['msg'],
      oldInputvalues:{
        email:email,
        password:password,
      }
    });
  }

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
      errormessage:message,
      oldInputvalues:{
        email:"",
        password:"",
        comfirmPassword:''
      }
    });
  };

exports.postSignup = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  const confirmPassword = req.body.confirmPassword

  const error_result = validationResult(req)
  console.log(error_result.array())
  if(!error_result.isEmpty()){
    let errors = error_result.array()
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pagetitle: 'Signup',
      isauthenticated: false,
      errormessage:errors[0]['msg'],
      oldInputvalues:{
        email:email,
        password:password,
        comfirmPassword:confirmPassword
      }
    });
  }

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

exports.getReset = (req,res,next)=>{
  let message = req.flash('error')
    if(message.length >0){
      message = message[0]
    }else{
      message = null
    }
    res.render('auth/reset', {
      path: '/reset',
      pagetitle: 'Reset Password',
      errormessage:message
    });
}

exports.postReset = (req,res,next)=>{
  crypto.randomBytes(32,(err,Buffer)=>{
    if(err){
      console.log(err)
      return res.redirect('/reset')
    }
    const token = Buffer.toString('hex')
    User.findOne({email:req.body.email})
    .then((user)=>{
      if(!user){
        req.flash('error','Entered Email id  not found')
        res.redirect('/reset')
      }

      user.resetToken = token
      user.resetTokenExpiration = Date.now()+300000 //5min
      return user.save()

    })
    .then(result=>{
      console.log(`http://localhost:3000/reset/${token}`)
      res.redirect('/')
    })
    .catch(err=>console.log(err))
  })
}

exports.getNewPassword = (req,res,next)=>{
  const token = req.params.token
  User.findOne({resetToken: token,resetTokenExpiration:{$gt: Date.now()}})
  .then((user)=>{
      let message = req.flash('error')
      if(message.length >0){
        message = message[0]
      }else{
        message = null
      }
      if(!user){
        req.flash('error','Invalid Token')
        return res.redirect('/login')
      }
      res.render('auth/update_password', {
        path: '/new-password',
        pagetitle: 'Reset Password',
        errormessage:message,
        userId: user._id.toString(),
        token:token
      });
  })
  .catch(err=>console.log(err))
}

exports.postNewPassword= (req,res,next)=>{
  const newpassword = req.body.password
  const userid = req.body.userid
  const token = req.body.token

  let resetuser    = ''
  User.findOne({
    resetToken:token,
    resetTokenExpiration:{$gt:Date.now()},
    _id:userid
  })
  .then((user)=>{
    resetuser = user
    return bcrypt.hash(newpassword,12)
  })
  .then((hashedpassword)=>{
    resetuser.password = hashedpassword,
    resetuser.resetToken = null
    resetuser.resetTokenExpiration = undefined
    
    return resetuser.save()

  })
  .then((result)=>{
    res.redirect('/login')
  })
  .catch(err=>console.log(err))

}