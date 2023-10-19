const invModel = require("../models/inventory-model");
const Util = {};

Util.getNav = async function(req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

Util.buildClassificationGrid = async function(data) {
  let grid;
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
};

Util.buildVehicleInfo = async function(data) {
  let display;
  let vehicle = data[0];
  if (vehicle) {
    display = `
    <section id="vehicle-display">
      <h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>
      <div id="vehicle-img-div">
        <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE motors"/>
      </div>
      <div id="vehicle-details">
        <h3>${vehicle.inv_make} ${vehicle.inv_model} Details</h3>
        <ul>
          <li>
            <h4>Price:</h4>
            <span>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>
          </li>
          <li>
            <h4>Description:</h4>
            <span>${vehicle.inv_description}</span>
          </li>
          <li>
            <h4>Color:</h4>
            <span>${vehicle.inv_color}</span>
          </li>
          <li>
            <h4>Miles:</h4>
            <span>${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)}</span>
          </li>
        </ul>
      </div>
    </section>
    `
    return display;
  } else {
    display = `
    <p>"This is not the vehicle you are looking for."<br>-Tatooine Wizard<br> Sorry, we couldn't find the vehicle you are searching for :/</p>
    `
    return display;
  }
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util;
