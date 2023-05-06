const express = require('express')
const router = express.Router()
const authcontroller = require('../controllers/auth')

const { check,body } = require('express-validator')


router.get('/login', authcontroller.getLogin)

router.post('/login',
    check('email').isEmail().withMessage('Please enter valid Email').normalizeEmail() ,
    body('password','Password should be minimum 5 characters').isLength({'min':5}).trim(), 
    authcontroller.postLogin)

router.post('/logout', authcontroller.postLogout);

router.get('/signup',  authcontroller.getSignup);

router.post('/signup', 
    check('email').isEmail().withMessage('Please enter valid Email').normalizeEmail() ,
    body('password','Password should be minimum 5 characters').isLength({'min':5}).trim(),
    body('confirmPassword','Password and confirm password doesnot match').
    custom((value,{req})=>{
        if(value !== req.body.password){
            throw new Error('Passwords do not match')
        }
        return true
    }).trim(),
    authcontroller.postSignup);

router.get('/reset',authcontroller.getReset);

router.post('/reset',authcontroller.postReset);

router.get('/reset/:token',authcontroller.getNewPassword);

router.post('/new-password', authcontroller.postNewPassword)




module.exports = router