const path = require("path");
var { Userdb, userSchema } = require("../model/user");
const express = require("express");
const rootDir = require("../util/path");
const Joi = require("joi");
const bcrypt = require("bcrypt");
// var jwt = require("jsonwebtoken");

const router = express.Router();


/**
 * 
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTA1MGQ4YWFmN2E5YTYxMzZhZWI1MDMiLCJET0IiOiIxOTk3LTA4LTE5VDE4OjAwOjAwLjAwMFoiLCJpYXQiOjE2Mjc3MjEwOTh9.skAh9GjEWHobS7tZR8X_Np1dNhOCdDIuKtz9yuSkuGI
 *  var token = jwt.sign({
    data: 'foobar'
    }, 'secret', { expiresIn: 20 }); //20 seconds
 */

//  http:localhost:3000/api/auth/   this is to authenticate: sign in
router.post("/login", async(req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await Userdb.findOne().and([
        { $or: [{ email: req.body.email }, { mobile1: req.body.mobile1 }] },
    ]);
    if (!user) return res.status(400).send("Invalid email or password"); //invalid email

    const validPassword = await bcrypt.compare(req.body.password, user.password); //bug fixed
    // console.log(validPassword)
    if (!validPassword) {
        return res.status(400).send("Invalid email or password"); //invalid password
    }
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(user);
});

router.post("/logout", async(req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await Userdb.findOne().and([
        { $or: [{ email: req.body.email }, { mobile1: req.body.mobile1 }] },
    ]);
    if (!user) return res.status(400).send("Invalid email or password"); //invalid email

    res.header('x-auth-token', '').send(user);
});

function validate(user) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255),
    });

    const validation = schema.validate(user);
    return validation;
}

module.exports = router;