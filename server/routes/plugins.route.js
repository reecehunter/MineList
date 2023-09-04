const pluginsController = require("../controllers/plugins.controller");

module.exports = (app) => {
    app.get("/api/plugins", pluginsController.getAll);
    app.get("/api/plugins/:id", pluginsController.getOne);
};