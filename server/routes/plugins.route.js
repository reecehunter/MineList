const pluginsController = require("../controllers/plugins.controller");
const usersController = require("../controllers/users.controller");

module.exports = (app) => {
  app.get("/api/plugins", pluginsController.getAll);
  app.get("/api/plugins/:id", pluginsController.getOne);
  app.get("/api/plugins/user/:userID", pluginsController.getAllByUserID);
  app.post("/api/plugins/create", usersController.verifyToken, pluginsController.createOne);
  app.post("/api/plugins/views/add/:id", pluginsController.addView);
  app.post("/api/plugins/downloads/add/:id", pluginsController.addDownload);
};
