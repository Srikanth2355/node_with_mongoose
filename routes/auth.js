const express = require('express')
const router = express.Router()
const authcontroller = require('../controllers/auth')

router.get('/login',authcontroller.getLogin)

router.post('/login',authcontroller.postLogin)

router.post('/logout', authcontroller.postLogout);

router.get('/signup', authcontroller.getSignup);

router.post('/signup', authcontroller.postSignup);

router.get('/reset',authcontroller.getReset);

router.post('/reset',authcontroller.postReset);

router.get('/reset/:token',authcontroller.getNewPassword);

router.post('/new-password', authcontroller.postNewPassword)




module.exports = router