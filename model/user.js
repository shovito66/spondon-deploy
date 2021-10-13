// const jwt = require('jsonwebtoken');
var { divisions } = require("./division");
var { districts } = require("./district");
var { upazillas } = require("./upazilla");

const Joi = require("joi");
const mongoose = require("mongoose");
// var uniqueValidator = require('mongoose-unique-validator');
var Float = require("mongoose-float").loadType(mongoose, 3);
var jwt = require("jsonwebtoken");

genderEnum = ["male", "female", "others"];
bloodEnum = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50,
        uppercase: true,
    },
    lastName: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 50,
        uppercase: true,
    },
    email: {
        type: String,

        required: true,
        minlength: 3,
        // maxlength: 15,
        unique: [true, "Email FOUND!!!"],
        lowercase: true,
    },

    mobile1: {
        type: String,
        required: true,
        maxlength: 14,
    },
    mobile2: {
        type: String,
        maxlength: 14,
    },
    // isAdmin: Boolean,
    isAdmin: {
        type: Boolean,
        default: false,
    },
    gender: {
        type: String,
        enum: ["male", "female", "others"],
        required: true,
        lowercase: true,
    },
    DOB: {
        type: Date,
        required: true,
        min: "1970-01-01", //YYYY-MM-DD
    },
    lastDonationDate: {
        type: Date,
    },
    lastActiveAt: {
        type: Date,
    },
    lastUpdateAt: {
        type: Date,
    },
    division: {
        type: mongoose.Schema.Types.ObjectId,
        ref: divisions,
        required: true,
    },
    district: {
        type: mongoose.Schema.Types.ObjectId,
        ref: districts,
        required: true,
    },
    upazilla: {
        type: mongoose.Schema.Types.ObjectId,
        ref: upazillas,
    },

    currentStatus: {
        type: Boolean,

        default: function() {
            if (!this.lastDonationDate) {
                //console.log("No lastDonationDate found");
                return true;
            }
            let date = new Date(this.lastDonationDate);
            // console.log("lastDonationDate--->");
            // console.log(date);
            let today = new Date();
            // console.log(today);
            let timeDiff = today.getTime() - date.getTime();
            let days = Math.floor(timeDiff / (1000 * 3600 * 24));
            // console.log("days--->");
            // console.log(days);
            if (days > 56) {
                // console.log("I CAN DONATE BLOOD AGAIN");
                return true;
            }
            return false;
        },
    },

    bloodGroup: {
        type: String,
        enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        required: true,
        uppercase: true,
    },
    remarks: {
        type: String,
        maxlength: 255,
    },
    /**
           *   validationID: {
              NID: {
                  type: String,
                  maxlength: 17,
                  minlength: 10,
              },
              smartCard: {
                  type: String,
                  maxlength: 17,
                  minlength: 10,
              },
              BirthCertificate: {
                  type: String,
                  maxlength: 17,

              },
              required: true
          },
           */
    NID: {
        type: String,
        maxlength: 17,
        minlength: 10,
    },
    smartCard: {
        type: String,
        maxlength: 17,
        minlength: 10,
    },
    BirthCertificate: {
        type: String,
        maxlength: 17,
    },
    password: {
        type: String,
        //required: true
    },
    passwordResetToken: String,
    passwordResetExpiresAt: Date,
    verified: {
        type: Boolean,
        default: false,
    },
});
// userSchema.plugin(uniqueValidator);

// userSchema.path('email').validate(async(email) => {
//     const emailCount = await mongoose.models.user.countDocuments({ email })
//     return !emailCount
// }, 'Email already exists')

// // userSchema.post('save', function(error, doc, next) {
// //     if (error.name === 'MongoError' && error.code === 11000) {
// //         next(new Error('email must be unique'));
// //     } else {
// //         next(error);
// //     }
// // });
// userSchema.post('save', function(error, doc, next) {
//     if (error.name === 'MongoError' && error.code === 11000) {
//         next(new Error('email must be unique'));
//     } else {
//         next(error);
//     }
// });
// middle ware in serial
// userSchema.pre('save', function preSave(next) {
//     var something = this;
//     something.lastUpdateAt(Date.now());
//     next();
// });

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, DOB: this.DOB },
        process.env.JWT_PRIVATE_KEY, { expiresIn: "2d" }
    );
    return token;
};


const Userdb = mongoose.model("User", userSchema);

function validateUser(user) {
    /**
     * //-----------------_THIS APPROACH IS NOT WORK FOR THE V16 VERSION-------------
     * const schema = {
        firstName: Joi.string().min(5).max(50).required(),
        lastName: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255),
        //isAdmin: Joi.boolean(),
        gender: Joi.boolean().required(),
        // DOB: Joi.date().format('YYYY-MM-DD').options({ convert: false }),
        address: Joi.string().min(5).max(255),
        mobile1: Joi.string().max(14),
    };
    return Joi.validate(user, schema);
 
     */

    const schema = Joi.object({
        firstName: Joi.string().min(1).max(50).required(),
        lastName: Joi.string().min(1).max(50).required(),
        email: Joi.string().min(3).required().email(),
        password: Joi.string().min(5).max(50),
        isAdmin: Joi.boolean(),
        gender: Joi.any().valid(...genderEnum), //Don't accept array
        bloodGroup: Joi.any().valid(...bloodEnum),
        DOB: Joi.date(),

        lastDonationDate: Joi.date(),
        lastActiveAt: Joi.date(),
        // lastActiveAt: Joi.date().default(Date.now),
        lastUpdateAt: Joi.date(),

        remarks: Joi.string().max(255),

        division: Joi.objectId().required(),
        district: Joi.objectId().required(),
        upazilla: Joi.objectId(),

        mobile1: Joi.string().max(14).required(),
        mobile2: Joi.string().max(14),

        NID: Joi.string().min(10).max(17),
        smartCard: Joi.string().min(10).max(17),
        BirthCertificate: Joi.string().max(17),

        currentStatus: Joi.boolean(),
    });

    const validation = schema.validate(user);
    return validation;
}

// module.exports = Userdb;
exports.Userdb = Userdb;
exports.userSchema = userSchema;
exports.validateUser = validateUser;
exports.bloodEnum = bloodEnum;


/**
 * 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//schema
var SomethingSchema = new Schema({
    text: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

//middle ware in serial
SomethingSchema.pre('save', function preSave(next) {
    var something = this;
    something.updatedAt(Date.now());
    next();
});
 */