const Joi = require('joi')
const mongoose = require('mongoose');
var Float = require('mongoose-float').loadType(mongoose, 3);
var { divisions } = require("../model/division");

const districtSchema = new mongoose.Schema({

    DivCode: {
        type: String,
        required: true
    },
    lat: {
        type: String,
        required: true,
    },
    longitude: {
        type: String,
        required: true,
    },
    District: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
})

const districts = mongoose.model('districts', districtSchema);

function validateDistrict(district) {
    const schema = Joi.object({
        DivisionCode: Joi.objectId().required(),
        lat: Joi.string().required(),
        longitude: Joi.string().required(),
        District: Joi.string().min(3).max(50).required(),
    });
    const validation = schema.validate(district);
    return validation;
}

exports.districts = districts;
exports.districtSchema = districtSchema;
exports.validateDistrict = validateDistrict;