var { ambulances, ambulanceSchema, validateAmbulance } = require("../model/ambulance")
const { match } = require("../util/path");
const Joi = require("joi");



exports.getAllAmbulances = async(req, res) => {
    // console.log(req.header("x-auth-token"));
    const allAmbulances = await ambulances.find({})
        .populate({
            path: "district division upazilla",
            // select: 'District Division -_id',
        })
        .sort({
            //1 is used for ascending order while -1 is used for descending order.
            division: 1,
            organizationName: -1,
        });
    res.send(allAmbulances);
};


exports.createAmbulance = async(req, res) => {

    console.log(req.body);
    const { error } = validateAmbulance(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const ambulance = await ambulances.find({ organizationName: req.body.organizationName, contactNo: req.body.contactNo }); //this AND Query

    if (ambulance.length > 0)
        return res
            .status(400)
            .send(
                "Already have an ambulance with this name and contact number. Please try with another name or update/delete the existing one"
            );


    const newAmbulance = new ambulances({
        organizationName: req.body.organizationName,
        contactNo: req.body.contactNo,
        remarks: req.body.remarks,
        division: req.body.division,
        district: req.body.district,
        upazilla: req.body.upazilla,
    });
    await newAmbulance.save();
    return res.status(200).send(newAmbulance)
};


exports.getAambulance = async(req, res) => {
    try {
        const aAmbulance = await ambulances.findById(req.params.id).populate({
            path: "district division upazilla",
            // select: 'District Division -_id',
        });
        if (!aAmbulance) return res.status(400).send("Invalid Ambulance.");
        res.send(aAmbulance);
    } catch (error) {
        res.status(500).send(error.message);
    }
};



exports.deleteAmbulance = async(req, res) => {
    try {
        const deletedAmbulance = await ambulances.findByIdAndDelete(req.params.id); //findByIdAndRemove
        if (!deletedAmbulance)
            return res
                .status(404)
                .send("Ambulance with given ID was not found for deletion.");
        res.send(deletedAmbulance);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.deleteAllAmbulances = async(req, res) => {
    const removedAllAmbulances = await ambulances.deleteMany();
    if (!removedAllAmbulances)
        return res.status(404).send("No ambulance was found to be deleted");
    res.send("Successfully Deleted All Ambulances");
};


exports.updateAmbulance = async(req, res) => {
    const { error } = validateAmbulance(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const updatedAmbulance = await ambulances.findByIdAndUpdate(
        req.params.id, {
            organizationName: req.body.organizationName,
            contactNo: req.body.contactNo,
            remarks: req.body.remarks,
            division: req.body.division,
            district: req.body.district,
            upazilla: req.body.upazilla,
        }, { new: true }
    );

    if (!updatedAmbulance)
        return res.status(404).send("Ambulance with given ID was not found.");
    res.send(updatedAmbulance);
};