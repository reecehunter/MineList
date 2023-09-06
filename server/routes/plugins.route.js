const pluginsController = require("../controllers/plugins.controller");

module.exports = (app) => {
    app.get("/api/plugins", pluginsController.getAll);
    app.get("/api/plugins/:id", pluginsController.getOne);
    app.post("/api/plugins/views/add/:id", pluginsController.addView);
    app.post("/api/plugins/downloads/add/:id", pluginsController.addDownload);
};