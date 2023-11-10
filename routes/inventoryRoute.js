const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const addValidate = require("../utilities/management-validation")

router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

router.get('/detail/:vehicleId', utilities.handleErrors(invController.buildByInventoryId));

router.get('/', utilities.handleErrors(invController.buildManagement));

router.get('/add-classification', utilities.handleErrors(invController.buildAddClassification));

router.post(
    '/add-classification',
    addValidate.addClassRules(),
    addValidate.checkAddClassData,
    utilities.handleErrors(invController.addClassification));

router.get('/add-inventory', utilities.handleErrors(invController.buildAddInventory));

router.post(
    '/add-inventory',
    addValidate.addInvRules(),
    addValidate.checkAddInvData,
    utilities.handleErrors(invController.addInventory));

module.exports = router;