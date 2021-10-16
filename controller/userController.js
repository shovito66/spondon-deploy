var { Userdb, validateUser, userSchema } = require("../model/user");
const Token = require("../model/token");
const sendEmail = require("../util/email");
const { match } = require("../util/path");
const Joi = require("joi");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var crypto = require("crypto");
const SendmailTransport = require("nodemailer/lib/sendmail-transport");

exports.getAllUser = async(req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const allUsers = await Userdb.find({})
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate({
                path: "district division upazilla",
                // select: 'District Division -_id',
            })
            .sort({
                //1 is used for ascending order while -1 is used for descending order.
                currentStatus: -1, //
                bloodGroup: 1,
                division: 1,
                firstName: -1,
            });
        res.header("x-auth-token", req.header("x-auth-token")).send(allUsers);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
};

exports.createUser = async(req, res) => {
    // console.log("I am in")
    console.log(req.body);
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const users = await Userdb.find().and([
        { $or: [{ email: req.body.email }, { mobile1: req.body.mobile1 }] },
    ]);
    // const users = await Userdb.find({ email: req.body.email, mobile1: req.body.mobile1 });  //this AND Query

    if (users.length > 0)
        return res
            .status(400)
            .send(
                "You have an account with this email/mobile. Please try with another one"
            );

    const salt = await bcrypt.genSalt(10);
    const hashedPW = await bcrypt.hash(req.body.password, salt);

    const newUser = new Userdb({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPW,
        gender: req.body.gender,
        DOB: req.body.DOB,
        lastDonationDate: req.body.lastDonationDate,
        lastActiveAt: new Date(req.body.lastActiveAt),
        lastUpdateAt: req.body.lastUpdateAt,
        bloodGroup: req.body.bloodGroup,
        remarks: req.body.remarks,

        division: req.body.division,
        district: req.body.district,
        upazilla: req.body.upazilla,

        mobile1: req.body.mobile1,
        mobile2: req.body.mobile2,

        NID: req.body.NID,
        smartCard: req.body.smartCard,
        BirthCertificate: req.body.BirthCertificate,

        currentStatus: req.body.currentStatus,
    });
    await newUser.save();
    const token = jwt.sign({ _id: newUser._id, DOB: newUser.DOB },
        process.env.JWT_PRIVATE_KEY, { expiresIn: "2d" }
    );
    // const token = user.generateAuthToken();
    res.header("x-auth-token", token).send(newUser);

    // await newUser.save()
    //     .then(function() {
    //         console.log('aircraft saved')
    //     }, function(err) {
    //         return res.status(400).send(err);
    //     });
    // res.send(newUser);
};

exports.getAUser = async(req, res) => {
    try {
        const aUser = await Userdb.findById(req.params.id).populate({
            path: "district division upazilla",
            // select: 'District Division -_id',
        });
        if (!aUser) return res.status(400).send("Invalid User.");
        res.send(aUser);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.updateUser = async(req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let flag = req.body.currentStatus;
    if (req.body.lastDonationDate) {
        let date = new Date(req.body.lastDonationDate);
        // console.log("lastDonationDate--->");
        // console.log(date);
        let today = new Date();
        // console.log(today);
        let timeDiff = today.getTime() - date.getTime();
        let days = Math.floor(timeDiff / (1000 * 3600 * 24));
        console.log("days--->");
        console.log(days);
        if (days < 56) {
            // console.log("I CAN DONATE BLOOD AGAIN");
            flag = false;
        }
        flag = true;
    }
    // const salt = await bcrypt.genSalt(10);
    // hashedPassword = await bcrypt.hash(req.body.password, salt);
    const updatedUser = await Userdb.findByIdAndUpdate(
        req.params.id, {
            firstName: req.body.firstName,
            lastName: req.body.lastName,

            password: req.body.password,
            gender: req.body.gender,
            DOB: req.body.DOB,
            lastDonationDate: req.body.lastDonationDate,
            lastActiveAt: Date.now(),
            lastUpdateAt: Date.now(),
            bloodGroup: req.body.bloodGroup,
            remarks: req.body.remarks,

            division: req.body.division,
            district: req.body.district,
            upazilla: req.body.upazilla,

            mobile1: req.body.mobile1,
            mobile2: req.body.mobile2,

            currentStatus: flag,
        }, { new: true }
    );

    if (!updatedUser)
        return res.status(404).send("User with given ID was not found.");
    res.header("x-auth-token", req.header("x-auth-token")).send(updatedUser);
};

exports.deleteUser = async(req, res) => {
    try {
        const deletedUser = await Userdb.findByIdAndDelete(req.params.id); //findByIdAndRemove
        if (!deletedUser)
            return res
                .status(404)
                .send("User with given ID was not found for deletion.");
        res.header("x-auth-token", req.header("x-auth-token")).send(deletedUser);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.deleteAllNonAdminUser = async(req, res) => {
    const deletedAllUser = await Userdb.deleteMany({ isAdmin: false });
    if (!deletedAllUser)
        return res.status(404).send("No user was found to be deleted");
    res.send("Successfully Deleted All non admin Users");
};

exports.forgotPassword = async(req, res) => {
    try {
        // const schema = Joi.object({ email: Joi.string().email().required() });
        // const { error } = schema.validate(req.body.email);
        // if (error) return res.status(400).send(error.details[0].message);

        const user = await Userdb.findOne().and([
            { $or: [{ email: req.body.email }, { mobile1: req.body.mobile1 }] },
        ]);
        if (!user)
            return res.status(400).send("user with given email doesn't exist");

        let token = await Token.findOne({ userId: user._id });

        if (!token) {
            let OTP = Math.floor(1000 + Math.random() * 9000).toString();
            console.log(OTP);
            // const hashedOTP = crypto
            //     .createHash("sha256")
            //     .update(OTP)
            //     .digest("hex");
            // console.log(hashedOTP)
            console.log(user);
            token = await new Token({
                userId: user._id,
                token: OTP,
            }).save();
        }

        // const link = `${process.env.BASE_URL}/reset/${user._id}/${token.token}`;
        const otpMsg = `You have requested for new password.\nEnter the OTP in your mobile.Your OTP will be valid for 5 minutes.\nOTP: ${token.token} \n\nregards\n-Shovito B. Soumma`;

        await sendEmail(user.email, "Reset Password", otpMsg);
        // res.send("password reset link sent to your email account");
        const message = "OTP has been sent to your email:" + user.email;
        res.send({
            message: message,
            email: user.email,
        });
    } catch (error) {
        res.status(404).send({
            message: "An error occurred.",
            email: user.email,
            status: false,
        });
        console.log(error);
    }
};

exports.resetPassword = async(req, res) => {
    try {
        const user = await Userdb.findById(req.params.userId);
        if (!user) return res.status(400).send("invalid link or expired"); //User Not Found

        const token = await Token.findOne({
            userId: user._id,
            // token: req.params.token,
            token: req.body.token,
        });
        if (!token) return res.status(400).send("Invalid link or expired"); //Token Not Found

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
        await user.save();
        await token.delete();

        const msg = `Your password has been reset successfully. - \n\nregards\n-Shovito B. Soumma`;
        await sendEmail(user.email, "Password Updated", msg);
        // res.send("password reset successfully.");
        res.send({
            message: "Password has been reset successfully.",
            email: user.email,
            status: true,
        });

    } catch (error) {
        res.status(404).send({
            message: "An error occurred.",
            email: user.email,
            status: false,
        });
        console.log(error);
    }
};