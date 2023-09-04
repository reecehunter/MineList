const sectionsController = require("../controllers/sections.controller");

module.exports = (app) => {
    app.get("/api/sections/:id", sectionsController.getOne);
};