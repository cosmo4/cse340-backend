const utilities = require(".")
const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")
const validate = {}

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registrationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),

    body("account_lastname")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),

    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists) {
          throw new Error("An account with that email ALREADY exists. Please log in or use different email.")
        }
      }),

    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
};


/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/registration", {
            errors,
            title: "Register",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }
    next()
}

/*  **********************************
 *  Login Data Validation Rules
 * ********************************* */
validate.LoginRules = () => {
  return [
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (!emailExists) {
          throw new Error("Account DOES NOT exist. Please register an account with that email or use your linked email account")
        }
      }),

  ]
}

validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/login", {
          errors,
          title: "Logged In",
          nav,
          account_email,
      })
      return
  }
  next()
}

/*  **********************************
 *  Update Account Data Validation Rules
 * ********************************* */
validate.updateAccountRules = () => {
  return [
    body("account_firstname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),

    body("account_lastname")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),

    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),
  ]
};

validate.checkUpdateData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/update-account", {
          errors,
          title: "Update Account",
          nav,
          account_firstname,
          account_lastname,
          account_email,
      })
      return
  }
  next()
}

validate.updatePasswordRules = () => {
  return [
    body("account_password")
    .trim()
    .isStrongPassword({
      minLength: 12,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage("Password does not meet requirements."),
]
}

validate.checkUpdatePassword = async (req, res, next) => {
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("account/update-account", {
          errors,
          title: "Update Account",
          nav,
      })
      return
  }
  next()
}

module.exports = validate