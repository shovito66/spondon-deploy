const Joi = require('joi')
const mongoose = require('mongoose');
var Float = require('mongoose-float').loadType(mongoose, 3);
var { districts } = require("../model/district");

const upazillaSchema = new mongoose.Schema({

    DistrictCode: {
        type: String,
        required: true
    },
    Upazilla: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    uid: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 10
    },
})

const upazillas = mongoose.model('upazillas', upazillaSchema);


function validateUpazilla(upazilla) {
    const schema = Joi.object({
        DistrictCode: Joi.objectId().required(),
        Upazilla: Joi.string().min(3).max(50).required(),
        uid: Joi.string().min(1).max(10).required(),

    });
    const validation = schema.validate(upazilla);
    return validation;
}

exports.upazillas = upazillas;
exports.upazillaSchema = upazillaSchema;
exports.validateUpazilla = validateUpazilla;