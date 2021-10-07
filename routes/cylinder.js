const path = require("path");
const cylinderController = require("../controller/cylinderController");
const authController = require("../middleware/auth");
const express = require("express");
const rootDir = require("../util/path");
const router = express.Router();

//// http://localhost:3000/api/cylinder?sort=name, {FIND ALL cylinder, also sort them division,namewise}
router.get("/", cylinderController.getAllCylinders);

router.post(
    "/",
    authController.authenticate,
    authController.restrictForAdmin,
    cylinderController.createCylinder
); // add an Cylinder
router.get("/:id", cylinderController.getAcylinder);

router.put(
    "/:id",
    authController.authenticate,
    authController.restrictForAdmin,
    cylinderController.updateCylinder
);

router.delete(
    "/:id",
    authController.authenticate,
    authController.restrictForAdmin,
    cylinderController.deleteCylinder
);

router.delete(
    "/",
    authController.authenticate,
    authController.restrictForAdmin,
    cylinderController.deleteAllCylinders
);

module.exports = router;