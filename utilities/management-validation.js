const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const validate = {}

// Add classification validation rules
validate.addClassRules = () => {
    return [
        body("classification_name")
        .matches(/^[A-Za-z]+$/)
        .trim()
        .isLength({ min: 3 })
        .withMessage("Please type only alphabetic letters with no spaces. It must be at least 3 letters.")
        .custom(async (classification_name) => {
            const reg = /^[a-zA-Z0-9]*$/
            if (!reg.test(classification_name)) {
                throw new Error("Please type only alphabetic letters with no spaces. It must be at least 3 letters.")
            }
            const classExists = await invModel.checkExistingClassification(classification_name)
            if (classExists) {
                throw new Error("A classification with that name ALREADY exists. Please use a new classification name.")
            }
        })
    ]
};

// Check data and return errors or continue
validate.checkAddClassData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("./inventory/add-classification", {
            errors,
            title: "Add Classification",
            nav,
            classification_name,
        })
        return
    }
    next()
}

module.exports = validate