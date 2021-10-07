const Joi = require('joi')
const mongoose = require('mongoose');
var Float = require('mongoose-float').loadType(mongoose, 3);


const divisionSchema = new mongoose.Schema({
    Division: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
})

const divisions = mongoose.model('divisions', divisionSchema);

function validateDivision(division) {
    const schema = Joi.object({
        Division: Joi.string().min(3).max(50).required(),
    });
    const validation = schema.validate(division);
    return validation;
}
exports.divisions = divisions;
exports.divisionSchema = divisionSchema;
exports.validateDivision = validateDivision;