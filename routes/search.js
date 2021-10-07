const path = require('path');
const searchController = require('../controller/searchController.js');
const express = require('express');
const rootDir = require('../util/path');
const router = express.Router();

//  http://localhost:3000/api/search/?name=xyz
// router.get('/', userController.getAUser); //default search --> show all donors currently available and nearest(will be in front end)
router.get('/', searchController.searchDonor); //http://localhost:3000/api/search/?name=xyz&bg=1&status=0/1&DivisionCode=40&DistrictCode=46
router.get('/ambulance', searchController.searchAmbulance); //http://localhost:3000/api/search/ambulance/?text=xyz&DivisionCode=40&DistrictCode=41
router.get('/cylinder', searchController.searchCylinder); //http://localhost:3000/api/search/cylinder/?text=xyz&DivisionCode=40&DistrictCode=41
module.exports = router