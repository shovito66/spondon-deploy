const path = require("path");
const ambulanceController = require("../controller/ambulanceController");
const authController = require("../middleware/auth");
const express = require("express");
const rootDir = require("../util/path");
const router = express.Router();

//// http://localhost:3000/api/amnbulance?sort=name, {FIND ALL ambulance, also sort them division,namewise}
router.get("/", ambulanceController.getAllAmbulances);

router.post(
    "/",
    authController.authenticate,
    authController.restrictForAdmin,
    ambulanceController.createAmbulance
); // add an Ambulance
router.get("/:id", ambulanceController.getAambulance);

router.put(
    "/:id",
    authController.authenticate,
    authController.restrictForAdmin,
    ambulanceController.updateAmbulance
);

router.delete(
    "/:id",
    authController.authenticate,
    authController.restrictForAdmin,
    ambulanceController.deleteAmbulance
);

router.delete(
    "/",
    authController.authenticate,
    authController.restrictForAdmin,
    ambulanceController.deleteAllAmbulances
);

module.exports = router;