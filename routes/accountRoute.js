const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")

router.get("/login", utilities.handleErrors(accountController.buildLogin));

router.get("/registration", utilities.handleErrors(accountController.buildRegistration));

// Route to register account
router.post("/registration", utilities.handleErrors(accountController.registerAccount));

module.exports = router;