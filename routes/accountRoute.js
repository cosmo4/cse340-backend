const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require("../utilities/account-validation")

router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement));

router.get("/login", utilities.handleErrors(accountController.buildLogin));

router.get("/registration", utilities.handleErrors(accountController.buildRegistration));

router.get("/update-account/", utilities.checkLogin, utilities.handleErrors(accountController.buildUpdateAccount));

router.get("/logout", utilities.checkLogin, utilities.handleErrors(accountController.accountLogout));

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
    utilities.handleErrors(accountController.accountLogin)
  )

// Route to process update account info

router.post(
    "/updateInfo",
    regValidate.updateAccountRules(),
    regValidate.checkUpdateData,
    utilities.handleErrors(accountController.updateAccount)
)


// Route to change password
router.post(
    "/updatePassword",
    regValidate.updatePasswordRules(),
    regValidate.checkUpdatePassword,
    utilities.handleErrors(accountController.updatePassword)
)

module.exports = router;