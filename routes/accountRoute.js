const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require("../utilities/account-validation")

router.get("/login", utilities.handleErrors(accountController.buildLogin));

router.get("/registration", utilities.handleErrors(accountController.buildRegistration));

// Route to register account
router.post(
    "/registration",
    regValidate.registrationRules(),
    regValidate.checkRegData, 
    utilities.handleErrors(accountController.registerAccount));

// Process the login attempt
router.post(
    "/login",
    regValidate.LoginRules(),
    regValidate.checkLoginData,
    (req, res) => {
      res.status(200).send('login process')
    }
  )

module.exports = router;