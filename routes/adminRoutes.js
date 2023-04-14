const express = require('express');
 const router = express.Router();
const Admin = require("../models/admin");
const sessionManager = require('./../middlewares/session')
const session = require('../middlewares/session')
const adminController = require('../controllers/adminController');
sessionManager.verifyLoginAdmin

router.get('/', adminController.getAdminLanding)
router.get('/adminDashboard',adminController.getAdminLanding)
router.get('/adminLogin',  adminController.getAdminLogin)
router.post('/login',adminController.postAdminLogin)
router.get('/logout',adminController.getAdminLogout)

router.get('/userDetails',session.verifyLoginAdmin, adminController.userDetails)
router.get('/blockUser/:id',session.verifyLoginAdmin,adminController.blockUser)
router.get('/unblockUser/:id',session.verifyLoginAdmin,adminController.unblockUser)
router.get('/products',session.verifyLoginAdmin,adminController.productDetails)
router.get('/editProducts/:id',session.verifyLoginAdmin,adminController.getEditProduct)
router.post('/products',session.verifyLoginAdmin,adminController.updateProduct)
router.get('/addProducts',session.verifyLoginAdmin,adminController.getAddProduct)
router.post('/addProducts',session.verifyLoginAdmin,adminController.postAddProduct)
router.get('/categories',session.verifyLoginAdmin,adminController.getCategories)
router.get('/addCategory',session.verifyLoginAdmin,adminController.getAddCategory) 
router.post('/categories',session.verifyLoginAdmin,adminController.postAddCategory)
router.get('/editCategory/:id',session.verifyLoginAdmin,adminController.getEditCategory)
router.get('/isActive/:id',session.verifyLoginAdmin,adminController.isActive)
router.get('/isInactive/:id',session.verifyLoginAdmin,adminController.isInactive)

router.post('/categories/:id',adminController.updateCategory)
router.get('/isActiveCategory/:id',session.verifyLoginAdmin,adminController.isActiveCategory)
router.get('/isInactiveCategory/:id',session.verifyLoginAdmin,adminController.isInactiveCategory)

 module.exports = router;