var {
    cylinderSchema,
    cylinders,
    validateCylinder,
} = require("../model/cylinder");
const { match } = require("../util/path");
const Joi = require("joi");

exports.getAllCylinders = async(req, res) => {
    // console.log(req.header("x-auth-token"));
    const allCylinders = await cylinders
        .find({})
        .populate({
            path: "district division upazilla",
            // select: 'District Division -_id',
        })
        .sort({
            //1 is used for ascending order while -1 is used for descending order.
            division: 1,
            organizationName: 1,
        });
    res.send(allCylinders);
};

exports.createCylinder = async(req, res) => {
    console.log(req.body);
    const { error } = validateCylinder(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const cylinder = await cylinders.find({
        organizationName: req.body.organizationName,
        contactNo: req.body.contactNo,
    }); //this AND Query

    if (cylinder.length > 0)
        return res
            .status(400)
            .send(
                "Already have an cylinder with this name and contact number. Please try with another name or update/delete the existing one"
            );

    const newCylinder = new cylinders({
        organizationName: req.body.organizationName,
        contactNo: req.body.contactNo,
        remarks: req.body.remarks,
        division: req.body.division,
        district: req.body.district,
        upazilla: req.body.upazilla,
    });
    await newCylinder.save();
    return res.status(200).send(newCylinder);
};

exports.getAcylinder = async(req, res) => {
    try {
        const aCylinder = await cylinders.findById(req.params.id).populate({
            path: "district division upazilla",
            // select: 'District Division -_id',
        });
        if (!aCylinder) return res.status(400).send("Invalid Cylinder.");
        res.send(aCylinder);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.deleteCylinder = async(req, res) => {
    try {
        const deletedCylinder = await cylinders.findByIdAndDelete(req.params.id); //findByIdAndRemove
        if (!deletedCylinder)
            return res
                .status(404)
                .send("Cylinder with given ID was not found for deletion.");
        res.send(deletedCylinder);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.deleteAllCylinders = async(req, res) => {
    const removedAllCylinders = await cylinders.deleteMany();
    if (!removedAllCylinders)
        return res.status(404).send("No cylinder was found to be deleted");
    res.send("Successfully Deleted All Cylinders");
};

exports.updateCylinder = async(req, res) => {
    const { error } = validateCylinder(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const updatedCylinder = await cylinders.findByIdAndUpdate(
        req.params.id, {
            organizationName: req.body.organizationName,
            contactNo: req.body.contactNo,
            remarks: req.body.remarks,
            division: req.body.division,
            district: req.body.district,
            upazilla: req.body.upazilla,
        }, { new: true }
    );

    if (!updatedCylinder)
        return res.status(404).send("Cylinder with given ID was not found.");
    res.send(updatedCylinder);
};