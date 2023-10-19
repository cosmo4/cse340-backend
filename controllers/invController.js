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


module.exports = invCont