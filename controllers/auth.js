const user = require('../models/user')

exports.getLogin = (req,res,next)=>{
        res.render('auth/login',{
            pagetitle:'login',
            path:'/login',
            isauthenticated: false
        })
}
exports.postLogin = (req,res,next)=>{
    user.findById("64112e3267a59c1136e52388")
    .then(user1=>{
        req.session.isLoggedIn = true
        req.session.user = user1
        res.redirect('/')
    })
    .catch(err=>console.log(err))
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
      console.log(err);
      res.redirect('/login');
    });
  };