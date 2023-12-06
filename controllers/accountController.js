const jwt = require("jsonwebtoken")
require("dotenv").config()
const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")


/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegistration(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/registration", {
        title: "Register",
        nav,
        errors: null,
    })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body
    
    // Hash the password before storing
    let hashedPassword
    try {
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        res.status(500).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }

    const regResult = await accountModel.registerAccount(
        account_firstname, account_lastname, account_email, hashedPassword
    )
    

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you're registered ${account_firstname}. Please log in.`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
            errors: null,
        })
    } else {
        req.flash("notice", "Sorry, the registration failed. Please try again.")
        res.status(501).render("account/registration", {
            title: "Register",
            nav,
            errors: null,
        })
    }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
        })
        return
    }
    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
            res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
            req.flash("notice", "You're logged in!")
            return res.redirect("/account/")
        }
    } catch (error) {
        return new Error('Access Forbidden')
    }
}

/* ****************************************
 *  Deliver Account Management View
 * ************************************ */
async function buildAccountManagement(req, res) {
    let nav = await utilities.getNav()
    let {accountData} = res.locals
    res.render("account/account-management", {
        title: "Account Management",
        nav,
        errors: null,
        accountData,
    })
}

/* ****************************************
 *  Deliver Update Account View
 * ************************************ */
async function buildUpdateAccount(req, res) {
    let nav = await utilities.getNav()
    let {accountData} = res.locals
    const account_id = accountData.account_id
    const account_firstname = accountData.account_firstname
    const account_lastname = accountData.account_lastname
    const account_email = accountData.account_email
    res.render("account/update-account", {
        title: "Update Account",
        nav,
        errors: null,
        account_id,
        account_firstname,
        account_lastname,
        account_email
    })
}

/* ****************************************
 *  Process Update Account
 * ************************************ */
async function updateAccount(req, res, next) {
    let nav = await utilities.getNav()
    let {accountData} = res.locals
    let { account_id, account_firstname, account_lastname, account_email } = req.body
    const updateResult = await accountModel.updateAccount(
        account_firstname, account_lastname, account_email, accountData.account_id
    )
    if (updateResult) {
        res.locals.accountData = await accountModel.getAccountById(accountData.account_id)
        accountData = res.locals.accountData
        req.flash("notice", "Account updated successfully.")
        res.status(201).render("account/account-management", {
            title: "Account Management",
            nav,
            errors: null,
            accountData
        })
    } else {
        req.flash("notice", "Sorry, the update failed. Please try again.")
        res.status(501).render("account/update-account", {
            title: "Update Account",
            nav,
            errors: null,
            account_id, account_firstname, account_lastname, account_email
        })
    }
}



module.exports = { buildLogin, buildRegistration, registerAccount, accountLogin, buildAccountManagement, buildUpdateAccount, updateAccount }