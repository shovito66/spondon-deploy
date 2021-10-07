var { Userdb, validateUser, userSchema } = require("../model/user");

const { request } = require("express");
var jwt = require("jsonwebtoken");


exports.authenticate = async(req, res, next) => {
    console.log("HI")
    const token = req.header("x-auth-token");
    if (!token) return res.status(401).send("Access denied. No token provided");
    try {
        const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
        request.user = decoded; //decoded Token
        // console.log(request.user) //decoded Token
        // console.log(decoded) //decoded Token
        next();
    } catch (error) {
        return res.status(400).send("Invalid token");
    }
};

exports.restrictForAdmin = async(req, res, next) => {
    const user = await Userdb.findById(req.user._id)
    if (!user.isAdmin)
        return res.status(403).send("Access denied. Log in as an admin");
    next();
};