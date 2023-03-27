const User = require('../models/user')
const bcrypt = require('bcryptjs')

exports.getLogin = (req,res,next)=>{
        res.render('auth/login',{
            pagetitle:'login',
            path:'/login',
            isauthenticated: false
        })
}
exports.postLogin = (req,res,next)=>{
    User.findById("64112e3267a59c1136e52388")
    .then(user1=>{
        req.session.isLoggedIn = true
        req.session.user = user1
        req.session.save((err)=>{
            console.log(err)
            res.redirect('/')
        })
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
    res.render('auth/signup', {
      path: '/signup',
      pagetitle: 'Signup',
      isauthenticated: false
    });
  };

exports.postSignup = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  const confirmPassword = req.body.confirmPassword

  User.findOne({email:email})
  .then((doc)=>{
    if(doc){
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
