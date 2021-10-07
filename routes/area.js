const path = require("path");
const areaController = require("../controller/areaController");
const express = require("express");
const rootDir = require("../util/path");
const router = express.Router();

router.get("/", areaController.getAllDivision); //http://localhost:3000/api/area/
router.get("/div/", areaController.getADivision); //http://localhost:3000/api/area/div/?id=40      -->hereID means divisionCode
router.get("/div/:id", areaController.getADivisionViaId); //http://localhost:3000/api/area/div/40  -->here 40 is division_id 

router.get("/disAll/", areaController.getAllDistricts); //http://localhost:3000/api/area/disAll/
router.get("/dis/", areaController.getDistrictsForDivision); //http://localhost:3000/api/area/dis/?id=40    -->hereID means divisionCode
router.get("/dis/:id", areaController.getDistrictsForDivisionViaId); //http://localhost:3000/api/area/dis/40     -->here 40 is division_id 


router.get("/upzAll/", areaController.getAllUpazillas); //http://localhost:3000/api/area/upzAll/
router.get("/upz/", areaController.getUpazillasForDistrict); //http://localhost:3000/api/area/upz/?id=1     -->hereID means districtCode
router.get("/upz/:id", areaController.getUpazillasForDistrictViaId); //http://localhost:3000/api/area/upz/1 -->here 1 means district_id


module.exports = router