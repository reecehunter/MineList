const statusController = require("../controllers/status.controller");

module.exports = (app) => {
    app.get("/api/status/:ip", statusController.getStatus);
};