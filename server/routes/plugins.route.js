const pluginsController = require("../controllers/plugins.controller");
const usersController = require("../controllers/users.controller");
const uploadFile = require("../helper/imageUploading");
const errorHandler = require("../helper/errorHandler");

module.exports = (app) => {
  app.get("/api/plugins", pluginsController.getAll);
  app.get("/api/plugins/:id", pluginsController.getOne);
  app.get("/api/plugins/detailed/:vanityURL", pluginsController.getOneWithRelatedData);
  app.post("/api/plugins/edit/:id", [usersController.verifyUserID, uploadFile.fields([{ name: "image", maxCount: 1 }]), errorHandler], pluginsController.editOne);
  app.get("/api/plugins/user/:userID", pluginsController.getAllByUserID);
  app.post(
    "/api/plugins/create",
    [
      usersController.verifyTokenMiddleware,
      uploadFile.fields([
        { name: "image", maxCount: 1 },
        { name: "jar", maxCount: 1 },
      ]),
      errorHandler,
    ],
    pluginsController.createOne
  );
  app.post("/api/plugins/downloads/add/:id", pluginsController.addDownload);
};
