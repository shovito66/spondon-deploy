var { divisions } = require("./division");
var { districts } = require("./district");
var { upazillas } = require("./upazilla");
const Joi = require("joi");
const mongoose = require("mongoose");

const ambulanceSchema = new mongoose.Schema({
    organizationName: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        uppercase: true,
    },
    division: {
        type: mongoose.Schema.Types.ObjectId,
        ref: divisions,
        required: true,
    },
    district: {
        type: mongoose.Schema.Types.ObjectId,
        ref: districts,
    },
    upazilla: {
        type: mongoose.Schema.Types.ObjectId,
        ref: upazillas,
    },
    contactNo: {
        type: String,
        required: true,
        maxlength: 14,
    },
    remarks: {
        type: String,
        maxlength: 255,
    },
});

const ambulances = mongoose.model("ambulances", ambulanceSchema);

function validateAmbulance(ambulance) {

    const schema = Joi.object({
        organizationName: Joi.string().min(5).max(50).required(),
        division: Joi.objectId().required(),
        district: Joi.objectId(),
        upazilla: Joi.objectId(),
        contactNo: Joi.string().max(14).required(),
        remarks: Joi.string().max(255),
    });
    const validation = schema.validate(ambulance);
    return validation;
}

exports.ambulances = ambulances;
exports.ambulanceSchema = ambulanceSchema;
exports.validateAmbulance = validateAmbulance;