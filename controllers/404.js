exports.pagenotfound=(req,res,next)=>{
        res.render('404',{pagetitle:"Page not Found",path:'',isauthenticated: req.isLoggedIn})
}