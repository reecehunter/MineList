const listingsController = require("../controllers/listings.controller");

module.exports = (app) => {
    app.get("/api/listings/:id", listingsController.getOne);
    app.get("/api/listings", listingsController.getMultiple);
};