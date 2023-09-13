const usersController = require("../controllers/users.controller");

module.exports = (app) => {
  app.post("/api/users/register", usersController.createOne);
  app.post("/api/users/login", usersController.login);
  app.post("/api/users/verify", usersController.verifyToken);
  app.get("/api/users/:username", usersController.getOneByUsername);
};
