const { query } = require("express");
var { Userdb, validateUser, userSchema, bloodEnum } = require("../model/user");
var { divisions } = require("../model/division");
const { districts } = require("../model/district");
var { ambulances } = require("../model/ambulance");
var { cylinders } = require("../model/cylinder");
const { match } = require("../util/path");


/**
 * 
 *resources
 bloodEnum = ['0:A+', '1:A-', '2:B+', '3:B-', '4:AB+', '5:AB-', '6:O+', '7:O-']
 */

////------------------------------------This APIs For Search----------------------------
exports.searchDonor = async(req, res) => {
    queryObj = {};

    if (bloodEnum[req.query.bg]) {
        queryObj.bloodGroup = bloodEnum[req.query.bg];
    }
    if (req.query.status === "0" || req.query.status === "1") {
        // console.log(req.query.status)
        queryObj.currentStatus = req.query.status;
    }

    if (req.query.DivisionCode) {
        console.log(req.query.DivisionCode);
        const division = await divisions
            .find({ DivisionCode: parseInt(req.query.DivisionCode) })
            .limit(1);
        console.log(division);
        queryObj.division = division[0]._id;
    }

    if (req.query.DistrictCode) {
        console.log(req.query.DistrictCode)
        const queryDistricts = await districts
            .find({ DistrictCode: req.query.DistrictCode })
            .limit(1);
        console.log(queryDistricts)
        if (queryDistricts.length > 0)
            queryObj.district = queryDistricts[0]._id;
    }

    const searchedUsers = await Userdb.find()
        .and([
            queryObj,
            {
                $or: [
                    { firstName: new RegExp(req.query.name, "i") },
                    { lastName: new RegExp(req.query.name, "i") },
                ],
            },
        ])
        .populate({
            path: "district division upazilla",
            // select: 'District Division -_id',
        })
        .sort({
            currentStatus: -1, //1 is used for ascending order while -1 is used for descending order.
            bloodGroup: 1,
            division: 1,
            firstName: -1,
        });

    // res.send(req.query.name)
    res.send(searchedUsers);
};

exports.searchAmbulance = async(req, res) => {
    queryObj = {};
    if (req.query.DivisionCode) {
        const division = await divisions
            .find({ DivisionCode: parseInt(req.query.DivisionCode) })
            .limit(1);

        if (division.length > 0)
            queryObj.division = division[0]._id;
    }

    if (req.query.DistrictCode) {
        console.log(req.query.DistrictCode)
        const queryDistricts = await districts
            .find({ DistrictCode: req.query.DistrictCode })
            .limit(1);
        console.log(queryDistricts)
        if (queryDistricts.length > 0)
            queryObj.district = queryDistricts[0]._id;
    }


    const searchedAmbulances = await ambulances
        .find()
        .and([
            queryObj,
            {
                $or: [
                    { organizationName: new RegExp(req.query.text, "i") },
                    { remarks: new RegExp(req.query.text, "i") },
                ],
            },
        ])
        .populate({
            path: "district division upazilla",
        })
        .sort({
            //1 is used for ascending order while -1 is used for descending order.
            division: 1,
            district: 1,
            upazilla: 1,
            organizationName: 1,
        });

    // res.send(req.query.name)
    res.send(searchedAmbulances);
};


exports.searchCylinder = async(req, res) => {
    queryObj = {};
    if (req.query.DivisionCode) {
        const division = await divisions
            .find({ DivisionCode: parseInt(req.query.DivisionCode) })
            .limit(1);

        if (division.length > 0)
            queryObj.division = division[0]._id;
    }

    if (req.query.DistrictCode) {
        console.log(req.query.DistrictCode)
        const queryDistricts = await districts
            .find({ DistrictCode: req.query.DistrictCode })
            .limit(1);
        console.log(queryDistricts)
        if (queryDistricts.length > 0)
            queryObj.district = queryDistricts[0]._id;
    }


    const searchedCylinders = await cylinders
        .find()
        .and([
            queryObj,
            {
                $or: [
                    { organizationName: new RegExp(req.query.text, "i") },
                    { remarks: new RegExp(req.query.text, "i") },
                ],
            },
        ])
        .populate({
            path: "district division upazilla",
        })
        .sort({
            //1 is used for ascending order while -1 is used for descending order.
            division: 1,
            district: 1,
            upazilla: 1,
            organizationName: 1,
        });

    res.send(searchedCylinders);
};