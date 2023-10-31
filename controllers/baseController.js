const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res) {
    const nav = await utilities.getNav()
    res.render("index", {title: "Home", nav, errors: null,})
}

baseController.buildCaughtError = async function(req, res) {
    const nav = await utilities.getNav();
    const title = '500 Internal Server Error';
    const message = 'Blast! Apparently, this is not the site you are looking for...';
    const imgSrc = '/images/site/visibleConfusion.jpg'
    res.render("errors/error", {
      nav,
      title,
      message,
      imgSrc
    });
  };

module.exports = baseController