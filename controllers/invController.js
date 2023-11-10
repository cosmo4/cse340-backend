const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* **********
 *  Build inventory by classification view
 * **********/

invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    })
}

invCont.buildByInventoryId = async function (req, res, next) {
  try {
    const vehicleId = req.params.vehicleId;
    const vehicleData = await invModel.getVehicleByInventoryId(vehicleId);
    
    if(!vehicleData) {
      res.status(404).send('Vehicle not found!');
      return;
    }

    const display = await utilities.buildVehicleInfo(vehicleData);
    let nav = await utilities.getNav();
    const vehicleName = vehicleData[0].inv_model;
    res.render("./inventory/vehicleDetails", {
      title: vehicleName,
      nav,
      display
    })
  } catch (error) {
    next(error);
  }
}

invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
  })
}

invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

// Process Adding classification
invCont.addClassification = async function (req, res) {
  
  const { classification_name } = req.body

  const addResult = await invModel.addClassification(classification_name)

  if (addResult) {
    req.flash(
      "notice",
      `Successfully added ${classification_name} to Classifications!`
    )
    let nav = await utilities.getNav()
    res.status(201).render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, adding the classification failed. Please try again.")
    res.status(501).render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null
    })
  }
}

invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let options = await utilities.buildClassificationOptions()
  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    options,
    errors: null,
  })
}

invCont.addInventory = async function (req, res, next) {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body

  const addResult = await invModel.addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color)

  if (addResult) {
    req.flash(
      "notice",
      `Successfully added ${inv_make} ${inv_model} to Inventory!`
    )
    let nav = await utilities.getNav()
    let options = await utilities.buildClassificationOptions()
    res.status(201).render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      options,
      errors: null
    })
  } else {
    let nav = await utilities.getNav()
    let options = await utilities.buildClassificationOptions()
    req.flash("notice", "Sorry, adding the vehicle failed. Please try again.")
    res.status(501).render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      options,
      errors: null
    })
  }
}


module.exports = invCont