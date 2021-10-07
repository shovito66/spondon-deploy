/**
 * Currently not using this file for Book Sharing Project
 */
const path = require('path');
const express = require('express');
// const controller = require('../controller/controller');

const rootDir = require('../util/path');

const router = express.Router();

const tuitionPosts = [];

// /admin/add-post => GET
router.get('/add-post', (req, res, next) => {
    // res.render('add-product', {
    //     pageTitle: 'Add Product',
    //     path: '/admin/add-product',
    //     formsCSS: true,
    //     productCSS: true,
    //     activeAddProduct: true
    // });

});

router.get('/sign-up', (req, res) => {
    res.render('sign-up');
    console.log("here is sign up page");
});


// router.post('/api/create', controller.create);



// // /admin/add-product => POST
// router.post('/add-product', (req, res, next) => {
//     // tuitionPosts.push({ title: req.body.title });
//     // res.redirect('/');
//     console.log("Admin will add a tuition post here");
// });

// module.exports = router;
module.exports = router;
//exports.tuitionPosts = tuitionPosts;