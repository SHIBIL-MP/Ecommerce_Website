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
// router.get('/detailPage',userController.detailPage)
router.get('/detailPage/:id',userController.detailPage)
router.get('/index',userController.getLanding)
router.get('/detailpage',userController.detailPage)
router.post('/user/otp',userController.postOtp);
router.post('/cart',session.verifyLogin,userController.getCart)
router.get('/cart',session.verifyLogin,userController.getCartProducts)
router.post('/change-product-quantity',userController.changeProductQuantity)
router.post('/product-remove',userController.productRemove)



module.exports=router;