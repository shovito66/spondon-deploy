var { divisions } = require("../model/division");
var { districts } = require("../model/district");
var { upazillas } = require("../model/upazilla");
const { match } = require("../util/path");
const { object } = require("joi");

// http://localhost:3000/api/area/
exports.getAllDivision = async(req, res) => {
    const allDivisions = await divisions.find();
    console.log("sajib");
    res.send(allDivisions);
};

exports.getADivision = async(req, res) => {
    try {
        const division = await divisions.find({
            DivisionCode: parseInt(req.query.id),
        });
        if (!division) return res.status(400).send("Invalid division.");
        res.send(division);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getADivisionViaId = async(req, res) => {
    try {
        const division = await divisions.findById(req.params.id);
        if (!division) return res.status(400).send("Invalid division.");
        res.send(division);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getAllDistricts = async(req, res) => {
    const allDistricts = await districts.find({});
    res.send(allDistricts);
};

exports.getDistrictsForDivision = async(req, res) => {
    try {
        const district = await districts.find({ DivCode: req.query.id });

        if (!district) return res.status(400).send("No District Found.");
        res.send(district);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getDistrictsForDivisionViaId = async(req, res) => {
    try {
        console.log("SOUMMMA------")
        const division = await divisions.findById(req.params.id);
        divisionCode = JSON.stringify(division).split(",")[1].split(":")[1]

        if (!division) return res.status(400).send("Invalid division Id");
        console.log(division)
            // console.log(division._id)
        console.log(divisionCode)

        // console.log(division.DivisionCode)
        // console.log(division["DivisionCode"])
        // console.log(division[DivisionCode])


        const district = await districts.find({ DivCode: divisionCode });



        if (!district) return res.status(400).send("No District Found.");
        console.log(district)
        res.send(district);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getAllUpazillas = async(req, res) => {
    const allupz = await upazillas.find({});
    res.send(allupz);
};

exports.getUpazillasForDistrict = async(req, res) => {
    try {
        const upz = await upazillas.find({
            DistrictCode: req.query.id,
        });

        if (!upz) return res.status(400).send("No upazillas Found.");
        res.send(upz);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.getUpazillasForDistrictViaId = async(req, res) => {
    try {
        const district = await districts.findById(req.params.id);
        districtCode = JSON.stringify(district).split(",")[3].split(":")[1].replace(/['"]+/g, '')
        districtCode = parseInt(districtCode, 10)

        if (!district) return res.status(400).send("Invalid District Id");
        const upz = await upazillas.find({
            DistrictCode: districtCode,
        });

        if (!upz) return res.status(400).send("No upazillas Found.");
        res.send(upz);
    } catch (error) {
        res.status(500).send(error.message);
    }
};