const path = require('path');
const userController = require('../controller/userController');
const authController = require('../middleware/auth');
const express = require('express');
const rootDir = require('../util/path');
const router = express.Router();

// // http://localhost:3000/api/user?sort=name, {FIND ALL user, also sort them}
router.get('/', authController.authenticate, userController.getAllUser);

router.post('/', userController.createUser); // signUp

// http://localhost:3000/api/user/:id
router.get('/:id', userController.getAUser);

// // http://localhost:3000/api/user/:id
router.put('/:id', authController.authenticate, userController.updateUser);

// // http://localhost:3000/api/user
router.delete('/:id', authController.restrictForAdmin, userController.deleteUser); //only for admin

// // http://localhost:3000/api/user
router.delete('/', authController.restrictForAdmin, userController.deleteAllNonAdminUser);

// http://localhost:3000/api/user/forgot
router.post('/forgot', userController.forgotPassword);
router.post('/verify-otp', userController.resetPassword); //// http://localhost:3000/api/user/verify-otp/:userId



module.exports = router