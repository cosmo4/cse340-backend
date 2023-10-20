const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

router.get('/detail/:vehicleId', utilities.handleErrors(invController.buildByInventoryId));


module.exports = router;