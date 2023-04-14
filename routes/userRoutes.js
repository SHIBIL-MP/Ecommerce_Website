const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const session = require('../middlewares/session')


// router.get('/',userController.getLanding)
// router.get('/signup',userController.getSignup)
// router.get('/login',userController.getLogin)
// router.get('/detailPage/:id',userController.detailPage)

router.get('/signup',userController.getSignup)
router.post('/signup',userController.postSignup)
router.get('/login',userController.getLogin)
router.post('/login',userController.postLogin)
router.get('/index',userController.getLanding)
router.get('/detailpage/:id',userController.detailPage)
router.post('/otp',userController.postOtp);



module.exports=router;