exports.getLogin = (req,res,next)=>{
        res.render('auth/login',{
            pagetitle:'login',
            path:'/login',
            isauthenticated: req.isLoggedIn
        })
}
exports.postLogin = (req,res,next)=>{
    req.isLoggedIn = true
    res.redirect('/')
}